var User = require('mongoose').model('User');

exports.byId = function(req, res, next, id){
    if (!id) return next();

    User.findOne({ _id : id }, function(err, user){
        if (err) return res.status(500).json(err);
        
        console.log('\n' + JSON.stringify(user));
        req.user = user;
        next();
    });
}

exports.id = function(req, res, next, id){
    if (!id) return next();

    req.userId  = id;
    next();
};
