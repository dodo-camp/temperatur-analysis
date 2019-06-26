var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var temperatureSchema = new Schema({
    ts: {
        type: Number
    },
    val: {
        type: Number
    }
});

temperatureSchema.index({"ts": 1});

module.exports = mongoose.model('Temperature', temperatureSchema );
