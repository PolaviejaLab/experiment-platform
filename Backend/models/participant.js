﻿var mongoose = require('mongoose');
var Participant = mongoose.model('Participant');


/**
 * Returns a list of available participants for the experiment
 */
exports.list = function (req, res) 
{
    Participant.find(
        { 'experiment': req.params.experimentId }, 
        { 'responses': false }, 
        function (err, participants) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(participants);
            }
        });
}


/**
 * Find a participant by ID
 */
exports.findOne = function (req, res) 
{
    Participant.findOne({ _id: req.params.participantId }, function (err, participant) 
    {
        if (participant === null) {
            res.status(404).json({ message: 'Participant not found' });
        } else if (err) {
            res.status(500).json(err);
        } else {
            res.json(participant);
        }
    });
}


/**
 * Creates a new participant
 */
exports.create = function (req, res) 
{
    if (!req.body.experiment)
        res.status(400); 
    
    if (!req.params.experimentId) {
        res.status(403).json({ message: 'Participant must be assinged to an experiment.' });
        return;
    }

    var participant = new Participant({ 'experiment': req.params.experimentId });

    participant.save(function(err) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(201).json(participant);
        }
    });
}


/**
 * Removes or hides a participant
 */
exports.delete = function (req, res) {
    Participant.findOne({ _id: req.params.id }, function (err, participant) {
        if (err) {
            res.status(404).json(err);
        } else {
            // If the participant has not started, remove completely
            if (!participant.started) {
                Participant.remove({ _id: req.params.id }, function (err) {
                    if (err)
                        res.json(false);
                    else
                        res.json(true);
                });
            } else {
                // Otherwise mark it as hidden
                participant.hidden = true;
                
                participant.save(function(err) {
                   if(err) {
                       res.status(400).json(err);                       
                   } else {
                       res.status(201).json(participant);
                   }
                });
            }
        }
    });
}
