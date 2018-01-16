var express = require('express'),
 ejs = require('ejs'),
 mongoose = require('mongoose'),
 Utente = require('./models/utenti'),
 Fornitore = require('./models/fornitori'),
 Prodotto = require('./models/prodotti'),
 app = express();


/*prima bisogna far partire mongod.bat (dovrebbe funzionare
 se si è lasciato il path di default nell'installazione)*/
mongoose.connect('mongodb://localhost/ilpiccoldb');

////set per cambiare la cartella standard delle view
//app.set('views', '../Html');
////engine e set per cambiare l'engine di base da .ejs a .html
//app.engine('html', ejs.renderFile);
//app.set('view engine', 'html');


app.set('view engine', 'ejs');
//use per specificare la cartella in cui si trovano i file statici (css, immagini...)
app.use(express.static('../public'));

//routes
app.get('/', function(req, res) {
	res.render('Homepage.ejs');
});

app.get('/contacts', function(req, res) {
	res.render('Contatti.ejs');
});

app.get('/login', function(req, res) {
	res.render('Accesso.ejs');
});

app.get('/register', function(req, res) {
	res.render('Registrazione.ejs');
});

app.get('/support', function(req, res) {
	res.render('Supporto.ejs');
});

app.get('/cart', function(req, res) {
	res.render('Carrello.ejs');
});

app.get('/catalog', function(req, res) {
	res.render('Catalogo.ejs');
});

app.get("*", function(req, res) {
	res.send("Che cazzo ce stai a fa qua ao");
});

//per indicare su che porta deve ascoltare il server
app.listen(3000, function() {
	console.log("Connesso correttamente al server sulla porta 3000");
});