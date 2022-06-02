const model = require('../model')

module.exports = async (event) => {

    const video = await model.getVideo(event.pathParameters.challengeId, event.pathParameters.userId)
    if(video && video.Item) {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, video: video.Item })
        }
    }
    return {
        statusCode: 404
    }
}
