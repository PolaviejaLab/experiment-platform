
var mongoose = require('mongoose');


var experimentSchema = new mongoose.Schema({
    'name': String,
    'description': String,
    'url': String,
    'password': String,
    'status': String,
    
    // List of domains that are allowed to initiate 
    // CORS requests for this experiment.
    'domains': [{ 'domain': String }]
});

mongoose.model('Experiment', experimentSchema);


var participantSchema = new mongoose.Schema({
    //'password': String,
    
    'experiment': [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experiment' }],   
 
    'started': Date,
    'finished': Date,

    // Response history for the participant
    // this can grow quite large.
    'responses': [{
        'timestamp': Date,
        'field': String,
        'value': String
    }],
});

mongoose.model('Participant', participantSchema)


mongoose.connect('mongodb://localhost/experiments')

module.exports = mongoose