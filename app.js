var express = require('express'),
 ejs = require('ejs'),
 mongoose = require('mongoose'),
 Utente = require('./models/utenti'),
 Fornitore = require('./models/fornitori'),
 Prodotto = require('./models/prodotti'),
 bodyParser= require("body-parser"),
 passport = require('passport'),
 localStrategy= require('passport-local');
 passportLocalMongoose= require('passport-local-mongoose');
 app = express();


/*prima bisogna far partire mongod.bat (dovrebbe funzionare
 se si è lasciato il path di default nell'installazione)*/
mongoose.connect('mongodb://localhost/ilpiccoldb');

////set per cambiare la cartella standard delle view
//app.set('views', '../Html');
////engine e set per cambiare l'engine di base da .ejs a .html
//app.engine('html', ejs.renderFile);
//app.set('view engine', 'html');

//APP SETTINGS
app.set('view engine', 'ejs');
//use per specificare la cartella in cui si trovano i file statici (css, immagini...)
app.use(express.static('../public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(Utente.authenticate()));
passport.serializeUser(Utente.serializeUser());
passport.deserializeUser(Utente.deserializeUser());



//ROUTES
app.get('/', function(req, res) {
	res.render('Homepage.ejs');
});

app.get('/contacts', function(req, res) {
	res.render('Contatti.ejs');
});

app.get('/login', function(req, res) {
	res.render('Accesso.ejs');
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

//REGISTRATION ROUTES
app.get('/register', function(req, res) {
	res.render('Registrazione.ejs');
});

app.post("/register", function(req, res){
	req.body.nomeUtente
	req.body.password
	req.body.email
	Utente.register(new Utente({ nomeUtente: req.body.nomeUtente}), req.body.password, req.body.email, function(err, user){
		if(err){
			console.log(err);
			return res.render("/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("*");
		});
	});
});

//LOGIN ROUTES

//per indicare su che porta deve ascoltare il server
app.listen(3000, function() {
	console.log("Connesso correttamente al server sulla porta 3000");
});