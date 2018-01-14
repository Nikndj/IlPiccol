var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaFornitore = new Schema({
	nomeFornitore: String,
	password: String,
	email: String,
	piva: Number, 
	indirizzo: String,
	cap: Number,
	citta: String
});

module.exports =  mongoose.model('Fornitore', schemaFornitore);