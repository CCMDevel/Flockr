module.exports = function(app){
    var cUser = require('../controllers/user.server.controller.js')();
    
    var setReqUser = require('../controllers/user.server.controller.params.js');

    app.post('/user/login/:userId', cUser.doLogIn);
    app.post('/user', cUser.create);

    app.get('/user', cUser.index);
    
    app.param('userId', setReqUser.byId);

    console.log('        user routes defined.');
}
