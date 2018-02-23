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
	"wishlist": [{ "type": Schema.Types.ObjectId, "ref": 'Prodotto'}],
	"nome": { "type": String, "required": false, "defaut": "" },
	"cognome": { "type": String, "required": false, "defaut": "" },
	"dataNascita": { "type": Date, "required": false, "defaut": Date.now() },
	"indirizzo": { "type": String, "required": false, "defaut": "" },
	"cap": { "type": Number, "required": false, "defaut": 1},
	"citta": { "type": String, "required": false, "defaut": "" },
	"numeroCarta": { "type": Number, "required": false, "defaut": 1}
}, {usePushEach: true});

schemaUtente.plugin(passportLocalMongoose);

module.exports = mongoose.model('Utente', schemaUtente);