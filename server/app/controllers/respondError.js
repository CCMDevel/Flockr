module.exports = function(res, code, err, msg, extras){
    
    /* 
        Errors:
            10 -> missing required things in request body
            11 -> missing required things in request params
            12 -> missing required things in request query
    */




    var getErrMsg = function(err){
        for (var name in err.errors){
            if (err.errors[name].message)
                return err.errors[name].message;
        }
        return "no msg";
    };

    var jsonErr = {
        err : err
    };

    if (msg){
        jsonErr.msg = msg;                     
    } else {
        jsonErr.msg = getErrMsg(err);
    }

    if (extras){
        for (var e in extras) jsonErr[e] = extras[e];
    }

    console.log('\n    ' + JSON.stringify(jsonErr));

    return res.status(code).json(jsonErr);
}
