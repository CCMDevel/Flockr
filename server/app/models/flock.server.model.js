var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FlockSchema = new Schema({
    type : {
        type : String,
        required : true, 
        uppercase : true,
        enum : [
            'E',
            'R'
        ]
    },
    author : {
        type : Schema.Types.ObjectId,
        required : true
    },
    created : {
        type : Number,
        default : Date.now
    },
    headline : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    }, 
    time_start : {
        type : Number,
        required : true
    },
    time_end : {
        type : Number,
        required : true
    },
    upvotes : {
        type : [{
            type : Schema.Types.ObjectId,
        }],
        default : []
    },
    spamReporters : {
        type : [{
            type : Schema.Types.ObjectId,
        }],
        default : []
    }

});

FlockSchema.methods.userUpvoted = function(userId, callback){
    this.populate({
        path : 'upvotes',
        match : {
            _id : userId
        }
    }, function(err, flock){
        if (err) return callback(err);
        
        callback(null, flock.upvotes.length > 0);
    });
};

mongoose.model('Flock', FlockSchema);

console.log('        models/flock initialized.');
