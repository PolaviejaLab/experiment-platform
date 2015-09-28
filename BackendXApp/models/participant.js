var mongoose = require('mongoose');
var Participant = mongoose.model('Participant');


/**
 * Returns a list of the available experiments.
 */
exports.list = function (req, res) {
    Participant.find({ 'experiment': req.query.experiment }, function (err, participants) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(participants);
        }
    });
}


exports.findOne = function (req, res) {
    Participant.findOne({ _id: req.params.id }, function (err, participant) {
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
exports.create = function (req, res) {
    if (!req.body.experiment)
        res.status(400); 
    
    console.log(req.body);
    
    if (!req.body.experiment) {
        res.status(403).json({ message: 'Participant must be assinged to an experiment.' });
        return;
    }

    var participant = new Participant(req.body);
    
    participant.save(function (err) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(201).json(participant);
        }
    });
}

exports.delete = function (req, res) {
    Participant.findOne({ _id: req.params.id }, function (err, experiment) {
        if (err) {
            res.status(404).json(err);
        } else {
            if (!experiment.started) {
                Participant.remove({ _id: req.params.id }, function (err) {
                    if (err)
                        res.json(false);
                    else
                        res.json(true);
                });
            }
        }
    });
}