const model = require('../model')

module.exports = async (event) => {

    if(!event.pathParameters || !event.pathParameters.userId) {
        return {
            statusCode: 404,
            body: JSON.stringify({message: "Invalid userId"})
        }
    }
    const userId = event.pathParameters.userId;

    const videos = await model.getUserVideos(userId)
    if(videos && videos.Items && videos.Items.length) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                videos: videos.Items,
            })
        }
    }
    return {
        statusCode: 404
    }
}
