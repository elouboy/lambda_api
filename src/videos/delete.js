const model = require('../model')

module.exports = async (event) => {

    const video = await model.deleteVideo(event.pathParameters.challengeId, event.pathParameters.userId)
    if(video) {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Video deleted successfully" })
        }
    }
    return {
        statusCode: 404
    }
}
