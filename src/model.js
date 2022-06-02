// const moment = require('moment')
const AWS = require('aws-sdk')
var crypto = require('crypto');

let dbClient

const TableName = process.env.TABLENAME_VIDEOS;

module.exports = {
    getVideo,
    getVideos,
    getVideosCount,
    getUserVideos,
    addVideo,
    updateVideo,
    deleteVideo,
}

function getDbClient () {
    if (!dbClient) {
        if(process.env.IS_OFFLINE === true || process.env.IS_OFFLINE === 'true') {
            dbClient = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: `http://localhost:${process.env.LOCAL_DB_PORT}` });
        }else {
            dbClient = new AWS.DynamoDB.DocumentClient();
        }
    }
    return dbClient
}

async function getVideo (challengeId, userId) {
    userId = userId;
    console.log(['1601894254', challengeId]);

    if (!challengeId) {
        return null;
    }

    const params = {
        TableName,
        Key: {
            challengeId,
            userId
        },
        ConsistentRead: true,
    }
    try {
        return await getDbClient().get(params)
            .promise()
    } catch(err) {
        console.error('DB error: ', err);
        return null;
    }

}


async function getVideosCount (challengeId) {

    var params = {
        TableName,
        Select: 'COUNT',
        FilterExpression: "challengeId = :challengeId",
        ExpressionAttributeValues: {
            ":challengeId": challengeId
        },
    };
    try {
        const countResult = await getDbClient().scan(params)
            .promise()
        if(countResult && countResult.Count) {
            return countResult.Count;
        }
    } catch(err) {
        console.error('DB error: ', err);
        return null;
    }
}

async function getVideos(challengeId, lastKey = null, limit = 100) {
    let videos = [];
    let result = await getAllVideos(challengeId, lastKey, limit)
    let LastEvaluatedKey = null;
    if(result && result.Items) {
        videos = result.Items;
        LastEvaluatedKey = result && result.LastEvaluatedKey ?  result.LastEvaluatedKey : null;
        while(videos.length < limit && LastEvaluatedKey !== null) {
            let result = await getAllVideos(challengeId, LastEvaluatedKey, limit)
            if(result && result.Items && result.Items.length) {
                for(let i = 0; i< result.Items.length; i++) {
                    let record = result.Items[i]
                    videos.push(record);
                    LastEvaluatedKey = { userId: record.userId, challengeId: record.challengeId }
                    if(videos.length >= limit) {
                        break;
                    }

                }
            }else {
                LastEvaluatedKey = null;
            }
        }
    }

    return {
        Items: videos,
        LastEvaluatedKey: LastEvaluatedKey
    }
}
async function getAllVideos (challengeId, lastKey = null, limit = 10) {
    var params = {
        TableName,
        FilterExpression: "challengeId = :challengeId",
        ExpressionAttributeValues: {
            ":challengeId": challengeId
        },
        ScanIndexForward: true,
        Limit: limit,
        ConsistentRead: true,
        Select: 'ALL_ATTRIBUTES',
        ReturnConsumedCapacity: 'NONE',
    };
    if(lastKey !== null) {
        params.ExclusiveStartKey = lastKey;
    }
    try {
        return await getDbClient().scan(params)
            .promise()
    } catch(err) {
        console.error('DB error: ', err);
        return null;
    }
}

async function getUserVideos (userId) {
    var params = {
        TableName,
        ScanIndexForward: true,
        Select: 'ALL_ATTRIBUTES',
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        }
    };
    try {
        return await getDbClient().scan(params)
            .promise()
    } catch(err) {
        console.error('DB error: ', err);
        return null;
    }
}

async function addVideo(Item) {

    const data = {
        ...Item,
        takeOn: new Date().toISOString(),
        createdAt: Math.floor(new Date().getTime()/1000),
    }
    console.log(data);
    const params = {
        TableName,
        Item: data,
    };

    try {
        const dbAdd = await getDbClient().put(params)
            .promise()
        if(dbAdd) {
            return data
        }
    } catch (err) {
        console.debug("ERROR: " + JSON.stringify(err));
    }
    return null;

}



async function updateVideo(challengeId, userId, Item) {
    userId = userId;
    const data = {
        ...Item,
        updatedAt: Math.floor(new Date().getTime()/1000),
    }

    let query = [];
    let queryValues = []
    for (const [key, value] of Object.entries(Item)) {
        query.push(`${key}=:${crypto.createHash('md5').update(key).digest("hex")}`);
        queryValues[`:${crypto.createHash('md5').update(key).digest("hex")}`] = value;
    }
    query.push('updatedAt=:ua')
    queryValues[':ua'] = data.updatedAt
    const params = {
        TableName,
        Key: {challengeId, userId},
        UpdateExpression: "set " + query.join(', '),
        ExpressionAttributeValues: queryValues,
    };

    try {
        const dbUpdate = await getDbClient().update(params)
            .promise()
        if(dbUpdate) {
            return data
        }
    } catch (err) {
        console.debug("ERROR: " + JSON.stringify(err));
    }
    return null;

}



async function deleteVideo(challengeId, userId) {
    userId = userId;
    const params = {
        TableName,
        Key: { challengeId, userId },
        ReturnValues: 'ALL_OLD'
    };

    try {
        const dbDelete = await getDbClient().delete(params)
            .promise()
        if(dbDelete && dbDelete.Attributes) {
            return true;
        }
    } catch (err) {
        console.debug("ERROR: " + JSON.stringify(err));
    }
    return null;

}
