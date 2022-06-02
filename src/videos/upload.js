const AWS = require('aws-sdk');
let S3;
const path = require('path')
if(process.env.IS_OFFLINE === 'true') {
    S3 = new AWS.S3({
        s3ForcePathStyle: true,
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER',
        endpoint: new AWS.Endpoint('http://localhost:4569'),
    });
}else {
    S3 = new AWS.S3();
}

module.exports = async (event) => {

    console.log('event is ', JSON.stringify(event));
    let fileContent = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;

    const originalFileName = event.pathParameters.fileName
    let fileName = `${Date.now()}`;

    let extension = path.extname(originalFileName)
    console.log('extension is ', extension);

    let fullFileName = `${fileName}${originalFileName}`
    console.log('fullFileName is ', fullFileName);


    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fullFileName,
        Body: fileContent,
        Metadata: {}
    };

    try {
        const stored = await S3.upload(params).promise()
        console.log('stored', stored);
        console.log('responding now');

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: 'File uploaded successfully',
                location: stored.Location,
                fileKey: stored.Key,
            })
        }
        // return put(process.env.BUCKET_NAME, fullFileName, fileContent)
        //     .then(() => {
        //         message = 'Saved ' + process.env.BUCKET_NAME + ':' + fullFileName;
        //         console.log(message);
        //         return {
        //             statusCode: 200,
        //             body: JSON.stringify({
        //                 message: 'File uploaded successfully',
        //                 location: fullFileName,
        //                 fileKey: fullFileName,
        //             })
        //         }
        //
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         return {
        //             statusCode: 400,
        //             body: JSON.stringify({
        //                 message: 'File upload failed'
        //             })
        //         }
        //
        //     });


    } catch (err) {
        console.log('storage error', err)
        return {
            statusCode: 400,
            body: JSON.stringify({ err: err })
        }
    }


}


// Create a promise to put the data in the s3 bucket
function put(destBucket, destKey, data) {
    return new Promise((resolve, reject) => {
        S3.putObject({
            Bucket: destBucket,
            Key: destKey,
            Body: data
        }, (err, data) => {
            if (err) {
                console.error('Error putting object: ' + destBucket + ':' + destKey);
                return reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
