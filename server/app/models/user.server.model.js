var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    secret : {
        type : String,
        required : true
    }, 
    created : {
        type : Number,
        default : Date.now
    },
    flocks : {
        type : [{
            type : Schema.Types.ObjectId
        }],
        default : []
    }
});

mongoose.model('User', UserSchema);

console.log('        models/user initialized.');
