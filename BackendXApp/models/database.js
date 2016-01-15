
var mongoose = require('mongoose');
var mongodbConnectionString = 'mongodb://localhost/experiments';


var experimentSchema = new mongoose.Schema({
    'name': String,
    'description': String,    
    'password': String,
    'status': String,
    
    // The URL is parsed to provide the schema and domain for the CORS
    // requests. In addition it will be used when inviting participants.  
    'url': String,    
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

mongoose.model('Participant', participantSchema);

/**
 * Attempt to connect to database, terminate application
 * if unsuccessful.
 */
mongoose.connect(mongodbConnectionString, function(err) {
    if(err) {
        console.log('Could not connect to MongoDB database.');
        console.log(' Connection string: ' + mongodbConnectionString);
        console.log(' Error:', err);
        process.exit(1);
    }
});

module.exports = mongoose