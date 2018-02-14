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
app.use(require('express-session')({
	secret: 'very secret words',
	resave: false,
	saveUninitialized: false
  }));
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
	//aggiungi reference a prodotto per ejs
	Prodotto.find({}, function(err, allProdotti){
        if(err){
            console.log(err);
        }else{
            res.render("Catalogo.ejs", {prodotti: allProdotti});
        }
    })
});

app.get("/catalog/:id", function (req, res){
	Prodotto.findById(req.params.id, function (err, foundProdotto) {
		if(err){
			console.log(err);
		}else{
			res.render("Item.ejs", {prodotti: foundProdotto})
		}
	});
});

app.get('/secret', isUserLoggedIn(), function (err) {
	console.log(err);
});

//REGISTRATION ROUTES
app.get('/register', function(req, res) {
	res.render('Registrazione.ejs');
});

app.post("/register", function(req, res) {
	var pass = req.body.password;
	var passRepeat = req.body.passwordRepeat;
	
	if (pass === passRepeat) {
		Utente.register(new Utente({username: req.body.username, admin: false}), req.body.password, function(err, user){
			if(err){
				console.log(err);
				return res.render("Registrazione.ejs");
			}
			passport.authenticate("local")(req, res, function(){
				res.redirect("/secret");
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

app.post("/login", isAdmin()

);
    
function isAdmin() {
	return function (req, res) {
		Utente.findOne({"username": req.body.username}, function (err, utente) {
			if (err){
				res.redirect("/login");
				console.log(err);
			}
			if(utente.admin){
				passport.authenticate("local")(req, res, function(){
					res.redirect("/admin");
				});
			} else {
				passport.authenticate("local")(req, res, function(){
					res.redirect("/secret");
				});
			}
		});
	}	
}

app.get("/logout", function(req, res){
	req.logOut();
	res.redirect("/");
});

function isUserLoggedIn() {
	return function(req, res){
	if (req.user) {
		res.redirect("/secret");
		}
	res.redirect("/login");
	}
}
/*
function isAdminLoggedIn() {
	return function(req, res, next) {
		Utente.findOne({"username": req.user}, function (err, utente) {
			if (err){
				res.redirect("/login");
				console.log(err);
			}
			if (req.isAuthenticated() && utente.admin) {
				return next();
			}
		});
		res.redirect("/login");
	}
}
*/
//ADMIN ROUTES and COMMANDS

app.get('/admin',  function(req, res) {
	res.render('adminPage.ejs');
});

app.post("/adminCreate", function (req, res){
	Prodotto.create({
		nome: req.body.nome,
		prezzo: req.body.prezzo,
	}, function(err, prodotto){
		if(err){
			console.log(err);
		}else{
			console.log("New Product Insert: ");
			console.log(prodotto);
		}
	});
	res.redirect("/admin");
});

//deve rimanere in fondo altrimenti le altre routes non funzionano
app.get("*", function(req, res) {
	res.send("Che cazzo ce stai a fa qua ao");
});


//per indicare su che porta deve ascoltare il server
app.listen(3000, function() {
	console.log("Connesso correttamente al server sulla porta 3000");
});