module.exports = function(app){
    var cFlock = require('../controllers/flock.server.controller.js')();
    var setReqFlock = require('../controllers/flock.server.controller.params.js');
    var setReqUser = require('../controllers/user.server.controller.params.js');

    app.post('/flock', cFlock.create);
   
    app.get('/flock/my/:userId', cFlock.getMyFlocks);
    app.get('/flock/flockId/:flockId', cFlock.get);
    app.get('/flock/currently/:time_current', cFlock.index);
 
    app.put('/flock/:flockId/reportSpam', cFlock.reportSpam);
    app.put('/flock/:flockId/upvote', cFlock.upvote);
    app.put('/flock/:flockId', cFlock.update);

    app.param('userId', setReqUser.id);
    app.param('flockId', setReqFlock.byId);
    app.param('time_current', setReqFlock.time_current);
    
    console.log('        flock routes defined.');
}
