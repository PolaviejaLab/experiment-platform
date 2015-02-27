
var mongoose = require('mongoose');


var experimentSchema = new mongoose.Schema({
    'name': String,
    'description': String,
    'url': String,
    'password': String,
    'status': String
});

mongoose.model('Experiment', experimentSchema);


var participantSchema = new mongoose.Schema({
    //'password': String,
    
    'experiment': [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experiment' }],   
 
    'started': Date,
    'finished': Date,

    'responses': [{
        'timestamp': Date,
        'field': String,
        'value': String
    }],
});

mongoose.model('Participant', participantSchema)


mongoose.connect('mongodb://localhost/experiments')

module.exports = mongoose