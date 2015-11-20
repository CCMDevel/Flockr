module.exports = function(callback){
    var mysql = require('mysql');

    console.log('    initializing mysql...');

    var db = mysql.createConnection({
        host : 'localhost',
        database : 'Flockr',
        user : 'Flockr',
        password : 'theseareflocksnoteventsb1tch'
    });

    db.query('SELECT 1 + 1 AS solution', function(err, rows, fields){
        if (err) throw err;

        console.log('        1 + 1 = ' + rows[0].solution);
        console.log('    mysql initialized.');

        callback(db);
    });
};
