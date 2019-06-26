var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost:27017/TemperatureDb';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.on('connected', () =>
    console.log('Database Connection was Successful')
);

db.on('disconnected', () =>
    console.log('Database Connection Disconnected')
);