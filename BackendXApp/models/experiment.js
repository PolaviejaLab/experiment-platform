var mongoose = require('mongoose');
var Experiment = mongoose.model('Experiment');
var url = require('url');

/**
 * Returns a list of the available experiments.
 */
exports.list = function (req, res) {
    Experiment.find({}, function (err, experiments) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(experiments);
        }
    });
}


/**
 * Returns a single experiment by id.
 */
exports.findOne = function (req, res) {
    Experiment.findOne({ _id: req.params.experimentId }, function (err, experiment) {
        var parts = url.parse(experiment.url);
        
        res.header('Access-Control-Allow-Origin', parts['protocol'] + "//" + parts['hostname']);
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Vary', 'Origin');

        if (err) {
            res.status(404).json(err);
        } else {
            res.json(experiment);
        }
    });
}


/**
 * Creates a new experiment
 */
exports.create = function (req, res) {
    var experiment = new Experiment(req.body);
    
    experiment.save(function (err) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(201).json(experiment);
        }
    });
}


/**
 * Update experiment
 */
exports.update = function (req, res) {
    var obj = req.body;
    delete obj._id;
    delete obj.__v;

    Experiment.findByIdAndUpdate(req.params.experimentId, {
        $set: obj
    }, { upsert: true }, function (err, experiment) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
        } else {
            res.json(experiment);
        }
    });
}

exports.delete = function (req, res) {
    Experiment.remove({ _id: req.params.experimentId }, function (err) {
        if (err)
            res.json(false);
        else
            res.json(true);
    }); 
}
