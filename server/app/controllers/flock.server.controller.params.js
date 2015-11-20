var Flock = require('mongoose').model('Flock');

exports.byId = function(req, res, next, id){
    if (!id) return next();

    Flock.findOne({ _id : id }, function(err, flock){
        if (err) return res.status(500).json(err);

        req.flock = flock;
        next();
    });
};

exports.time_current = function(req, res, next, time_current){
    req.time_current = time_current;
    next();
};
