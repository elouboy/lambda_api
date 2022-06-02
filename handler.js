'use strict';

module.exports = {
    videoCreate: require('./src/videos/create'),
    videoGet: require('./src/videos/get'),
    videoUpdate: require('./src/videos/update'),
    videoDelete: require('./src/videos/delete'),
    getAllVideos: require('./src/videos/getAllVideos'),
    getAllUserVideos: require('./src/videos/getAllUserVideos'),
    videoUpload: require('./src/videos/upload'),
};
