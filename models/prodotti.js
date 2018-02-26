var mongoose = require('mongoose');
//var Utente = require('utenti.js');
var Schema = mongoose.Schema;
var nodemailer = require('nodemailer');
var Utente = require('../models/utenti');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'transporterilpiccol@gmail.com',
		pass: "transpiccol"
	}
});

var schemaProdotto = new Schema({
	"nome": { "type": String, "required": true },
	"nomeVisualizzato" :{ "type": String, "required": true },
	"prezzo":{ "type": Number, "required": true },
	"dataInserimento": { "type": Date, "required": true },
	"prezzoScontato": { "type": Number, "required": false }, //di base uguale al prezzo
	"emailProduttore": { "type": String, "required": true }, //nel form type=email.
	"quantita": { "type": Number, "default": 1},
	"immagine": { "type": String, "required": true }, //il link es."https://i.imgur.com/lyFdSv2.png"
	"commenti": [{"testo": String, "data": Date, "autore": String, "voto": Number}],
	"descrizione": { "type": String, "required": true, "default": "Descrizione oggetto" }, 
	"votoMedio": { "type": Number, "required": false, "default": 0},
	"esaurito": { "type": Boolean, "required": true, "default": false },
	"utentiInteressati": [{ "type": Schema.Types.ObjectId, "ref": "Utente"}]
}, {usePushEach: true});


schemaProdotto.pre("save", function(next){
	if (!this.isNew && this.isModified('quantita') && this.quantita <= 0) {
		this.esaurito = true;
	}
	if (!this.isNew && this.isModified('quantita') && this.quantita > 0 && this.esaurito) {
		this.esaurito = false;
		var mailOptionsUtenti = {
			from: 'transporterilpiccol@gmail.com',
			to: '',
			subject: 'Prodotto ' + this.nome + ' disponibile',
			text:'Il prodotto ' + this.nome + ' è di nuovo disponibile'
		};
		this.utentiInteressati.forEach(function(idUtente){
			Utente.findById(idUtente).exec(function(err, utente){
				if (err) console.log(err);
				else {
					mailOptionsUtenti.to = utente.email;
					transporter.sendMail(mailOptionsUtenti, function(err, info){
						if (err) console.log(err);
					});
				}
			});
		});
	}
	if (!this.isNew && this.isModified('quantita') && this.quantita < 5) {
		var mailOptionsAdmin = {
			from: 'transporterilpiccol@gmail.com',
			to: "admpiccol@gmail.com",
			subject: 'Prodotto ' + this.nome + ' in scadenza',
			text:'Il prodotto ' + this.nome + ' sta per esaurirsi'
		};
		transporter.sendMail(mailOptionsAdmin, function(err, info){
			if (err) console.log(err);
		});
	}
	next();
});

module.exports = mongoose.model('Prodotto', schemaProdotto);