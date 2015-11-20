var express = require('express')
    , morgan = require('morgan')
    , compress = require('compression')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , session = require('express-session');

var config = require('./config');

module.exports = function(){
    var app = express();

    if (process.env.NODE_ENV === 'devel'){
        app.use(morgan('dev'));
    } else {
        app.use(compress());
    }
    
    app.use(bodyParser.urlencoded({ extended : true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(session({
        saveUninitialized : true,
        resave : true,
        secret : config.sessionSecret,
        cookie : {
            maxAge : 1000 * 3600 * 24 * 60
        }
    }));

    console.log('    initializing routes...');
    
    require('../app/routes/user.server.routes.js')(app);
    require('../app/routes/flock.server.routes.js')(app);    

    console.log('    routes initialized.');

    return app;
};
