var config = require('./config');

var mongoose = require('mongoose');

module.exports = function(){
    console.log('    initializing mongoose...');

    var db = mongoose.connect(config.db);

    require('../app/models/user.server.model.js');
    require('../app/models/flock.server.model.js');

    console.log('    mongoose initialized.');

    return db;
};
