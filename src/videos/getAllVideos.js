const model = require('../model')

module.exports = async (event) => {


    let limit = 100;
    if(event && event.queryStringParameters && event.queryStringParameters.limit) {
        limit = event.queryStringParameters.limit
    }
    if(!event.pathParameters || !event.pathParameters.challengeId) {
        return {
            statusCode: 404,
            body: JSON.stringify({message: "Invalid challengeId"})
        }
    }
    const challengeId = event.pathParameters.challengeId;

    const lastUserId = event && event.queryStringParameters && event.queryStringParameters.hasOwnProperty('lastUserId') ? event.queryStringParameters.lastUserId : null
    const lastChallengeId = event && event.queryStringParameters && event.queryStringParameters.hasOwnProperty('lastChallengeId') ? event.queryStringParameters.lastChallengeId : null
    let lastKey = null;
    if(event.queryStringParameters) {
        if((event.queryStringParameters.hasOwnProperty('lastUserId') && !event.queryStringParameters.hasOwnProperty('lastChallengeId')) || (event.queryStringParameters.hasOwnProperty('lastChallengeId') && !event.queryStringParameters.hasOwnProperty('lastUserId'))) {
            return {
                statusCode: 404,
                body: JSON.stringify({message: "Provide both lastUserId and lastChallengeId to get next page data"})
            }
        }else if(event.queryStringParameters.hasOwnProperty('lastUserId') && event.queryStringParameters.hasOwnProperty('lastChallengeId')) {
            lastKey = { userId: lastUserId, challengeId: lastChallengeId }
        }
    }

    const videos = await model.getVideos(challengeId, lastKey, parseInt(limit))
    console.log('videos', videos);
    if(videos) {
        const responseData = {
            videos: videos.Items,
            total: await model.getVideosCount(challengeId),
        }
        if(videos.LastEvaluatedKey) {
            responseData.lastUserId = videos.LastEvaluatedKey.userId;
            responseData.lastChallangeId = videos.LastEvaluatedKey.challengeId;
        }
        return {
            statusCode: 200,
            body: JSON.stringify(responseData)
        }
    }
    return {
        statusCode: 404
    }
}
