const model = require('../model')

module.exports = async (event) => {
    let payload

    try {
        payload = JSON.parse(event.body)
    } catch (e) {
        console.error('Error while parsing the request', e)
    }

    if(!payload.userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'userId is required' })
        }

    }
    const video = await model.addVideo(payload)

    if(video) {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, video: video })
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({ success: false })
    }
}
