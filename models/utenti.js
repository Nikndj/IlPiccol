var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var schemaUtente = new Schema({
	username: String,
	//email: String,
	password: String,
	admin: Boolean
	/*
	nome: String,
	cognome: String,
	dataNascita: Date,
	indirizzo: String,
	cap: Number,
	citta: String
	*/
});

schemaUtente.plugin(passportLocalMongoose);

module.exports = mongoose.model('Utente', schemaUtente);