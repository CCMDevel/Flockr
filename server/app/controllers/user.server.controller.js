module.exports = function(){
    var User = require('mongoose').model('User');
    var respondError = require('./respondError.js');

    var c = {};

    c.create = function(req, res, next){
        if (!req.body) return respondError(res, 400, 10, "body");
        
        var newUser = new User(req.body);
        newUser.save(function(err){
            if (err) return respondError(res, 500, err);

            console.log(JSON.stringify({ user : newUser }) + '\n');
            res.status(201).json({ user : newUser });
        });
    };

    c.doLogIn = function(req, res, next){
        if (!req.body) return respondError(res, 400, 10, 'body');
        if (!req.body.secret) return respondError(res, 400, 10, 'secret');
        if (!req.user) return respondError(res, 400, 11, 'userId');

        if (req.user.secret === req.body.secret){
            req.session.userId = req.user._id;
            console.log('');

            res.json({
                loggedIn : true
            });
        } else {
            res.json({
                loggedIn : false
            });
        }
    };

    c.index = function(req, res, next){
        User.find({}, { secret : 0 },  function(err, uIndex){
            if (err) return respondError(res, err);

            console.log('');
            res.json(uIndex);
        });
    };

    return c;
};
