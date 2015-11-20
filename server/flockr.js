process.env.NODE_ENV = process.env.NODE_ENV || 'devel';

console.log('initializing flockr...');

var express = require('./config/express');
var mongoose = require('./config/mongoose.js');

mongoose();
var app = express(); 
   
app.listen(3050, function(){
    console.log('flockr.js now listening on port 3050');
});
