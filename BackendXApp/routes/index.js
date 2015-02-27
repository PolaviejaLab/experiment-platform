var express = require('express');
var router = express.Router();

var experiment = require('../models/experiment.js');
var participant = require('../models/participant.js');

router.get('/experiment', experiment.list);
router.get('/experiment/(:id)', experiment.findOne);
router.post('/experiment', experiment.create);
router.post('/experiment/(:id)', experiment.update);
router.delete('/experiment/(:id)', experiment.delete);


router.get('/participant', participant.list);
router.post('/participant', participant.create);
router.delete('/participant/(:id)', participant.delete);

/**
 * Assign participant ID
 */
/*router.post('/experiment/[id]/participant', function (req, res) {
    var participant = new Participant({});

    console.log(req);
});*/

//router.post('/experiment/id/participant/id/finished')

module.exports = router;
