var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var schemaUtente = new Schema({
	nomeUtente: String,
	password: String,
	email: String, 
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