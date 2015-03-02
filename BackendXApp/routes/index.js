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
// Returns a participant with previous responses
// Seeing the responses should show password
//  router.get('/participant/(:id)', participant.findOne);
router.post('/participant', participant.create);
router.delete('/participant/(:id)', participant.delete);


// Start experiment
//  router.post('/participant/(:id)/start');
//  router.post('/participant/(:id)/stop');

// Channel for server to client communication
//  router.get('/participant/(:id)/source');

// Channel for client to server communication
//  router.post('/participant/(:id)/sink');

//router.post('/experiment/id/participant/id/finished')

module.exports = router;
