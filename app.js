var express = require('express');
var ejs = require('ejs');
var app = express();

//set per cambiare la cartella standard delle view
app.set('views', '../Html');
//engine e set per cambiare l'engine di base da .ejs a .html
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
//use per specificare la cartella in cui si trovano i file statici (css, immagini...)
app.use(express.static('../public'));

//routes
app.get('/', function(req, res) {
	res.render('Homepage.html');
});

app.get('/login', function(req, res) {
	res.render('Accesso.html');
});

app.get('/register', function(req, res) {
	res.render('Registrazione.html');
});

app.get('/cart', function(req, res) {
	res.render('Carrello.html');
});

app.get('/catalog', function(req, res) {
	res.render('Catalogo.html');
});

//per indicare su che porta deve ascoltare il server
app.listen(3000, function() {
	console.log("Connesso correttamente al server sulla porta 3000");
});