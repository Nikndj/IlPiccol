var mongoose = require('mongoose');
//var Utente = require('utenti.js');
var Schema = mongoose.Schema;

var schemaProdotto = new Schema({
	nome: String,
	nomeVisualizzato : String,
	prezzo: Number,
	dataInserimento: Date,
	prezzoScontato: Number, //di base uguale al prezzo
	emailProduttore: String, //nel form type=email.
	quantita: Number,
	immagine: String, //il link es."https://i.imgur.com/lyFdSv2.png"
	commenti: [{testo: String, data: Date, autore: String, voto: Number}],
	descrizione: String, 
	//tags: [String],
	votoMedio: Number,
});

module.exports = mongoose.model('Prodotto', schemaProdotto);