var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var AppointmentSchema = new Schema({
    speciality: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
    	type: String,
    	required: true
    },
    created_at: Date,
});

AppointmentSchema.pre('save', function(next){
	var appointment = this;

	var currentDate = new Date();

	if(!appointment.created_at){
		appointment.created_at = currentDate;
	}

	next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);