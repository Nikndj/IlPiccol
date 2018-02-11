var mongoose = require('mongoose');
//var Utente = require('utenti.js');
var Schema = mongoose.Schema;

var schemaProdotto = new Schema({
	nome: String,
	prezzo: Number,
	dataInserimento: Date,
	prezzoScontato: Number, //di base uguale al prezzo
	emailProduttore: String, 
	quantita: Number,
	//immagine: [ObjectId] ?
	//commenti: [{testo: String, data: Date, autore: String, voti: Number}],
	//tags: [String],
	voto: Number
});

module.exports = mongoose.model('Prodotto', schemaProdotto);