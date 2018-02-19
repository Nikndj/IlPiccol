var mongoose = require('mongoose');
//var Utente = require('utenti.js');
var Schema = mongoose.Schema;
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'transporterilpiccol@gmail.com',
		pass: "transpiccol"
	}
});

var schemaProdotto = new Schema({
	"nome": String,
	"nomeVisualizzato" : String,
	"prezzo": Number,
	"dataInserimento": Date,
	"prezzoScontato": Number, //di base uguale al prezzo
	"emailProduttore": String, //nel form type=email.
	"quantita": Number,
	"immagine": String, //il link es."https://i.imgur.com/lyFdSv2.png"
	"commenti": [{"testo": String, "data": Date, "autore": String, "voto": Number}],
	"descrizione": String, 
	"votoMedio": Number
});


schemaProdotto.pre("save", function(next){
	if (!this.isNew && this.isModified('quantita') && this.quantita < 5) {
		var mailOptions = {
			from: 'transporterilpiccol@gmail.com',
			to: "admpiccol@gmail.com",
			subject: 'Prodotto' + this.nome + ' in scadenza',
			text:'Il prodotto ' + this.nome + ' sta per esaurirsi'
		};
		transporter.sendMail(mailOptions, function(err, info){
			if (err) console.log(err);
		});
	}
	next();
});


module.exports = mongoose.model('Prodotto', schemaProdotto);




/*<% prodotti.commenti.forEach(function(commento){%>
<p><%= commento.autore%>, il <%= commento.data.getDate()%>/<%= commento.data.getMonth()%>/<%= commento.data.getFullYear()%>
   , ore <%= commento.data.getHours()%>:<%= commento.data.getMinutes()%> con Voto: <%= commento.voto%> dice:</p>
<p><%= commento.testo%></p>
<hr>
<% })%>*/