module.exports = function(){
    var User = require('mongoose').model('User');
    var Flock = require('mongoose').model('Flock');
    var respondError = require('./respondError.js');

    var c = {};

    c.create = function(req, res, next){
        if (!req.body) return respondError(res, 400, 10, "body");
        if (!req.body.author) return respondError(res, 400, 10, "author");
        
        if (!req.body.time_start && !req.body.time_end) {
            return respondError(res, 400, 10, "times");
        }

        if (req.body.time_start > req.body.time_end) return respondError(res, 400, 10, "start time > end time");

        if (req.session.userId == req.body.author){   
            console.log('    0'); 
            var newFlock = new Flock(req.body);
            newFlock.save(function(err){
                if (err) return respondError(res, 500, err);
            
                console.log('    1');
                User.findOneAndUpdate({ _id : req.body.author }, {
                    $push : {
                        flocks : newFlock._id
                    }
                }, function(err, user){
                    if (err) return res.status(500).json(err);
                    
                    console.log('    2');
                    res.status(201).json(newFlock);
                });
            });
        } else {
            console.log('    not signed in');
            res.json({ loggedIn : false });
        }
    };

    c.get = function(req, res, next){
        if (!req.flock) return respondError(res, 400, 11, 'flockId');

        console.log('');
        res.json(req.flock);
    };

    c.index = function(req, res, next){
        if (!req.time_current) return respondError(res, 400, 11, 'time_current');

        Flock.find({})
        .where('time_end').gt(req.time_current)
        .exec(function(err, flocks){
            if (err) return respondError(res, 500, err);

            console.log('');
            res.json({ flocks : flocks });
        });
    };

    c.getMyFlocks = function(req, res, next){
        if (!req.userId) return respondError(res, 400, 11, 'userId');
        if (!req.session || req.session.userId != req.userId) return res.json({ loggedIn : false });

        Flock.find({ author : req.userId }, function(err, flocks){
            if (err) return respondError(res, 500, err);

            res.json({ flocks : flocks });
        });
    };

    c.reportSpam = function(req, res, next){
        if (!req.flock) return respondError(res, 400, 11, 'flockId');
        if (!req.body) return respondError(res, 400, 10, 'body');
        if (!req.body.userId) return respondError(res, 400, 10, 'userId');

        if (!req.session || req.session.userId != req.body.userId) return res.json({ loggedId : false }); 
        
        var reportedAsSpam = req.flock.spamReporters.indexOf(req.body.userId);

        reportedAsSpam = (reportedAsSpam >= 0 ? true : false);

        var update = {};
        
        if (reportedAsSpam) {
            update.$pull = {
                spamReporters : req.body.userId
            };
        } else {
            update.$push = {
                spamReporters : req.body.userId
            }
        }
        
        Flock.findOneAndUpdate({ _id : req.flock._id }, update, function(err, flock){
            if (err) return respondError(res, 500, err);
            
            if (flock.spamReporters.length >= 2){
                flock.remove(function(err){
                    if (err) return respondError(res, 500, err);

                    return res.status(202).json({
                        flockId : req.flock._id,
                        removed : true
                    });
                });
            } else {
                res.status(202).json({
                    flockId : flock._id,
                    updated : flock,
                    removed : false
                });
            }
        });
    };

    c.upvote = function(req, res, next){
        if (!req.flock) return respondError(res, 400, 11, 'flockId');
        if (!req.body) return respondError(res, 400, 10, 'body');
        if (!req.body.userId) return respondError(res, 400, 10, 'userid');

        if (!req.session || req.session.userId != req.body.userId) return res.json({ loggedId : false }); 
        
        var upvoted = req.flock.upvotes.indexOf(req.body.userId);

        upvoted = (upvoted >= 0 ? true : false);

        var update = {};
        
        if (upvoted) {
            update.$pull = {
                upvotes : req.body.userId
            };
        } else {
            update.$push = {
                upvotes : req.body.userId
            }
        }
        
        Flock.findOneAndUpdate({ _id : req.flock._id }, update, function(err, flock){
            if (err) return respondError(res, 500, err);
            
            res.status(202).json({ updated : flock });
        });
    };

    c.update = function(req, res, next){
        if (!req.flock) return respondError(res, 400, 11, 'flockId');
        if (!req.body) return respondError(res, 400, 10, 'body');
        if (!req.body.author) return respondError(res, 400, 10, 'author');

        if (!req.session || req.session.userId != req.body.author) {
            console.log('\n    not logged on');
            return res.json({ loggedId : false }); 
        }
        req.flock.type = req.body.type;
        req.flock.headline = req.body.headline;
        req.flock.location = req.body.location;
        req.flock.time_start = req.body.time_start;
        req.flock.time_end = req.body.time_end;
        req.flock.save(function(err, flock){
            if (err) return respondError(res, 500, err);

            res.status(202).json({ updated : flock });
        });
         
    };

    return c;
}


