var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var schemaUtente = new Schema({
	"username": String,
	"email": { "type": String, "required": true, "default": ""},
	"password": String,
	"admin": { "type": Boolean, "required": true, "default": false},
	"carrello": [{ 
		prodotto: { "type": Schema.Types.ObjectId, "ref": 'Prodotto' }, 
		quantita: { "type": Number, "default": 1 }
	}],
	"ordiniPassati": [{ "type": Schema.Types.ObjectId, "ref": 'Ordine' }],
	"wishlist": [{ "type": Schema.Types.ObjectId, "ref": 'Prodotto'}]
		/*
	nome: String,
	cognome: String,
	dataNascita: Date,
	indirizzo: String,
	cap: Number,
	citta: String
	*/
}, {usePushEach: true});

schemaUtente.plugin(passportLocalMongoose);

module.exports = mongoose.model('Utente', schemaUtente);