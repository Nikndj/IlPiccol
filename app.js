var express = require('express'),
 ejs = require('ejs'),
 mongoose = require('mongoose'),
 passport = require('passport'),
 bodyParser= require("body-parser"),
 Utente = require('./models/utenti'),
 Fornitore = require('./models/fornitori'),
 Prodotto = require('./models/prodotti'),
 localStrategy= require('passport-local');
 passportLocalMongoose= require('passport-local-mongoose');
 app = express();


/*prima bisogna far partire mongod.bat (dovrebbe funzionare
 se si è lasciato il path di default nell'installazione)*/
mongoose.connect('mongodb://localhost/ilpiccoldb');

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

app.get('/support', function(req, res) {
	res.render('Supporto.ejs');
});

app.get('/cart', function(req, res) {
	res.render('Carrello.ejs');
});

app.get('/catalog', function(req, res) {
	res.render('Catalogo.ejs');
});

//REGISTRATION ROUTES
app.get('/register', function(req, res) {
	res.render('Registrazione.ejs');
});

app.post("/register", function(req, res) {
	//req.body.nomeUtente
	var pass = req.body.password
	var passRepeat = req.body.passwordRepeat
	//req.body.email
	if (pass === passRepeat) {
		Utente.register(new Utente({nomeUtente: req.body.nomeUtente, email: req.body.email}), req.body.password, function(err, user){
			if(err){
				console.log(err);
				return res.render("Registrazione.ejs");
			}
			passport.authenticate("local")(req, res, function(){
				res.redirect("*");
			});
		});
	} else {
		res.redirect("Registrazione.ejs");
		console.log("Le password non coincidono");
	}
});

//LOGIN ROUTES
app.get('/login', function(req, res) {
	res.render('Accesso.ejs');
});

app.post("/login", passport.authenticate("local",{
    successRedirect: "secret.ejs",
    failureRedirect: "Accesso.ejs"
}), function (req, res) {
});

app.get("/logout", function(req, res){
	req.logOut();
	res.redirect("/");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//deve rimanere in fondo altrimenti le altre routes non funzionano
app.get("*", function(req, res) {
	res.send("Che cazzo ce stai a fa qua ao");
});


//per indicare su che porta deve ascoltare il server
app.listen(3000, function() {
	console.log("Connesso correttamente al server sulla porta 3000");
});