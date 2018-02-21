var express = require('express'),
 ejs = require('ejs'),
 mongoose = require('mongoose'),
 passport = require('passport'),
 bodyParser= require("body-parser"),
 Utente = require('./models/utenti'),
 Prodotto = require('./models/prodotti'),
 Ordine = require('./models/ordini'),
 localStrategy= require('passport-local'),
 passportLocalMongoose= require('passport-local-mongoose'),
 path = require('path'),
 app = express();

/*prima bisogna far partire mongod.bat (dovrebbe funzionare
 se si è lasciato il path di default nell'installazione)*/
mongoose.connect('mongodb://localhost/ilpiccoldb', {useMongoClient: true});

//APP SETTINGS
app.set('view engine', 'ejs');
app.use(require('express-session')({
	secret: 'very secret words',
	resave: false,
	saveUninitialized: false
}));

//use per specificare la cartella in cui si trovano i file statici (css, immagini...)
app.use(express.static(path.join(__dirname, 'public')));
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

app.get('/RisultatiRicerca', function(req,res){
	res.render('RisultatiRicerca.ejs');
});

app.get('/NotFound', function(req, res){
	res.render('NotFound.ejs');
});

app.get('/itemManagement',function(req,res){
	Prodotto.find({}, function(err, prodotti){
		res.render('itemManagement.ejs', {prodotti: prodotti});
	});
});

app.post('/itemManagementPrezzo', function(req,res){
	Prodotto.findByIdAndUpdate(req.body.idProdotto, {
		"prezzoScontato": req.body.inputPrezzo, "dataInserimento": new Date()},function(err, prodottoDaAggiornare){
		if(err){
			console.log("Non è stato trovato")
			console.log(err);
			res.redirect('/admin');
		}else{
			console.log("E' stato aggiornato")
			console.log(prodottoDaAggiornare);
		}
	});
	res.redirect('/admin');
});

app.post('/itemManagementImmagine', function(req,res){
	Prodotto.findByIdAndUpdate(req.body.idProdotto,{
		"immagine": req.body.inputImmagine, "dataInserimento": new Date()}, function(err, prodottoDaAggiornare){
		if(err){
			console.log("Non è stato trovato")
			console.log(err);
			res.redirect('/admin');
		}else{
			console.log("E' stato aggiornato")
			console.log(prodottoDaAggiornare);
		}
	});
	res.redirect('/admin');
});

app.post('/itemManagementQuantita', function(req, res){
	Prodotto.findById(req.body.idProdotto, function(err, prodottoDaAggiornare){
		if (err) {
			console.log("Errore");
			console.log(err);
		} else {
			prodottoDaAggiornare.quantita = Number(req.body.inputQuantita); 
			prodottoDaAggiornare.save(function(err){
				if (err) console.log(err);
			});
		}
	});
	res.redirect('/admin');
});

//stringa dalla BarraDiRicerca passa da MARIO LOMBARDI a mario lombardi
//converte in un array di stringhe con delimitatore es. [mario, lombardi]
//viene salvato sulla variabile "tuttiiprodotti" ogni prodotto
//parte complessa. Find usato a caso perchè non so mettere una function da sola senza sminchiare tutto.
//viene fatto il foreach su "tuttiiprodotti"
//viene fatto il foreach di ogni parola chiave
//viene controllata la corrispondenza della parola chiave nel nome di ogni prodotto
//viene aggiunto al risultato nel caso venga trovato e che non sia già presente nella soluzione
app.post("/RisultatiRicerca", function(req,res){
	var stringa=req.body.cerca.toLowerCase();
		var paroleChiave = stringa.split(" ");
		Prodotto.find({},function(err,tuttiiprodotti){
		if(err){
			console.log(err);
		}else{
			Prodotto.find({nome: null},function(err,arrayProdotti){
			    tuttiiprodotti.forEach(function(item){
				    paroleChiave.forEach(function(parolaChiave){
						var pos = item.nome.indexOf(parolaChiave);
					    if(pos>=0){
							if(arrayProdotti.length<=0){
								arrayProdotti.push(item);
							}else{
								var trovato=false;
								arrayProdotti.forEach(function(oggetto){
									if(oggetto._id===item._id){
										trovato=true;
									}
								})
								if(trovato==false){
								arrayProdotti.push(item);
								}
						    }
					    }
				    })
				})
				if(err){
				console.log(err);
				res.render('NotFound.ejs');
			    }else{
					if(arrayProdotti.length==0){
						res.render('NotFound.ejs');
					}else{
						if(req.body.sort=="decrNome"){
							arrayProdotti.sort(function(a, b){
								var x = a.nome.toLowerCase();
								var y = b.nome.toLowerCase();
								if (x < y) {return -1;}
								if (x > y) {return 1;}
								return 0;
							}).reverse();
						}else if(req.body.sort=="crescNome"){
							arrayProdotti.sort(function(a, b){
								var x = a.nome.toLowerCase();
								var y = b.nome.toLowerCase();
								if (x < y) {return -1;}
								if (x > y) {return 1;}
								return 0;
							});
						}else if(req.body.sort=="crescPrezzo"){
							arrayProdotti.sort(function(a, b){return a.prezzoScontato - b.prezzoScontato});
						}else if(req.body.sort=="decrPrezzo"){
							arrayProdotti.sort(function(a, b){return a.prezzoScontato - b.prezzoScontato}).reverse();
						}else if(req.body.sort=="recenti"){
							arrayProdotti.sort(function(a, b){return a.dataInserimento - b.dataInserimento});
						}else if(req.body.sort=="crescVoto"){
							arrayProdotti.sort(function(a, b){return a.votoMedio - b.votoMedio});
						}else if(req.body.sort=="decrVoto"){
							arrayProdotti.sort(function(a, b){return a.votoMedio - b.votoMedio}).reverse();
						}
                        res.render('RisultatiRicerca.ejs', { prodotti: arrayProdotti });
					}
				}
			});
	    }
	});	
});

app.get('/recensione',function(req,res){
	res.render('recensione.ejs');
});

app.post('/recensione', function(req,res){
	var recUser=req.user.username;
	Utente.findOne({username : recUser},function(err,User){
		var recProd=req.body.prodottoRecensione;
		var recText=req.body.testoRecensione;
		var recVote=req.body.votoRecensione;
		if(err||User==null){
			console.log(err);
			res.redirect('/register');
		}else{
			Prodotto.findById(recProd,function(err,lui){
				if(err){
					console.log(err);
				}else{
					var strunz= false;
					lui.commenti.forEach(function(commento){
						if(commento.autore==recUser){
							strunz=true;
						}
					})
					if(strunz==false){
						Prodotto.findByIdAndUpdate(recProd,{
						$addToSet: { commenti: {testo: recText, data: new Date(), autore: recUser, voto: recVote}}},
						{ new: true },function(err,updated){
		                    if(err){
						        console.log(err);
					        }else{
								var media;
								var somma=0;
								updated.commenti.forEach(function(commento){
		                             somma=somma+commento.voto;
								})
								media=somma/updated.commenti.length;
								Prodotto.findByIdAndUpdate(recProd,{votoMedio: media},{ new: true },function(err,suino){
									if(err){
										console.log("Media non aggiornata");
									}else{
										console.log("Media Voti Updated");
									}
								});
								res.redirect('/catalog');
					        }  
						});
					}else{
						console.log("questo utente ha già recensito questo prodotto");
						res.redirect('/catalog');
					}
				}
			});
		}
	});
});

app.get('/cart', isLoggedIn, function(req, res) {
	Utente.findById(req.user._id).populate({path: 'carrello.prodotto'}).exec(function(err, utente){
		res.render('Carrello.ejs', { elementi: utente.carrello });
	});
});

app.post('/modificaProdottoCarrello/:idProdotto/:idQuantita', isLoggedIn, function(req, res){
	console.log(req.body[req.params.idQuantita]);
	Utente.findById(req.user._id).exec(function(err, utente){
		utente.carrello.forEach(function(elemento){
			if (req.params.idProdotto == elemento.prodotto){ 
				elemento.quantita = req.body[req.params.idQuantita];
				utente.save(function(err){
					if (err) console.log(err);
					else res.redirect('/cart');
				});
			}
		});
	});
});

app.post('/eliminaProdottoCarrello/:id', isLoggedIn, function(req, res){
	Utente.findById(req.user._id).exec(function(err, utente){
		utente.carrello.forEach(function(elemento){
			if (req.params.id == elemento.prodotto){
				utente.carrello.splice(utente.carrello.indexOf(elemento.prodotto), 1);
				utente.save(function(err){
					if (err) console.log(err);
					else res.redirect('/cart');
				});
			}
		});
	});
});

app.post('/concludiOrdine', isLoggedIn, function(req, res){
	var carrello = req.user.carrello;
	Utente.findById(req.user._id).populate({path: 'carrello.prodotto'}).exec(function(err, utente){
		var totale = 0;
		utente.carrello.forEach(function(elemento){
			totale += elemento.prodotto.prezzo * elemento.quantita;
			elemento.prodotto.quantita -= elemento.quantita;
			elemento.prodotto.save(function(err){});
		});
		Ordine.create({
			"utente": utente._id,
			"prodotti": utente.carrello,
			"totale": totale,
			"data": Date.now()
		}, function(err, ordine){
			if (err) console.log(err);
			else {
				utente.carrello = [];
				utente.ordiniPassati.push(ordine._id);
				console.log(utente.ordiniPassati);
				utente.save(function(err){
					if (err) console.log(err);
					else res.render('/checkout', { ordine: ordine });
				});
			}
		}); 
	});
});

app.get('/checkout', isLoggedIn, function(req, res){
	res.render('Checkout.ejs');
});

app.get('/storicoOrdini', isLoggedIn, function(req, res){
	Utente.findById(req.user._id).populate({path: 'ordiniPassati', populate: { path: 'prodotti.prodotto' }}).exec(function(err, utente){
		console.log(utente);
		res.render('StoricoOrdini.ejs', { ordini: utente.ordiniPassati });	
	});
});

app.get('/catalog', function(req, res) {
	//aggiungi reference a prodotto per ejs
	Prodotto.find({}, function(err, allProdotti){
        if(err){
            console.log(err);
        }else{
            res.render("Catalogo.ejs", {prodotti: allProdotti});
        }
    });
});

app.get("/catalog/:id", function (req, res) {
	Prodotto.findById(req.params.id, function (err, foundProdotto) {
		if (err) {
			console.log(err);
		} else {
			res.render("Item.ejs", {prodotti: foundProdotto});
		}
	});
});

//per aggiungere un prodotto al carrello
app.post("/catalog/:id", isLoggedIn, function(req, res) {
	Utente.findById(req.user._id, function(err, utente){
		if (err) console.log(err);
		else {
			var trovato = false;
			utente.carrello.forEach(function(elemento){
				if(elemento.prodotto == req.params.id) {
					//prodotto già presente nel carrello
					elemento.quantita += Number(req.body.quantita);
					trovato = true;
				}
			});
			if (!trovato) {
				//prodotto non presente nel carrello
				utente.carrello.push({"prodotto": req.params.id, "quantita": req.body.quantita});
			}
			utente.save(function(err){
				if (err) console.log(err);
				else res.redirect("/cart");
			});
		}
	});
});

app.post('/catalog/:id/wishlist', isLoggedIn, function(req, res){
	Utente.findById(req.user._id, function(err, utente){
		if (err) console.log(err);
		else {
			var trovato = false;
			utente.wishlist.forEach(function(elemento){
				if(elemento == req.params.id) {
					//prodotto già presente nella wishlist
					trovato = true;
				}
			});
			if (!trovato) {
				//prodotto non presente nella wishlist
				utente.wishlist.push(req.params.id);
				Prodotto.findById(req.params.id).exec(function(err, prodotto){
					if (err) console.log(err);
					else {
						if (prodotto.utentiInteressati.indexOf(utente._id) < 0)
							prodotto.utentiInteressati.push(utente._id);
					}
					prodotto.save(function(err){
						if (err) console.log(err);
					});
				});
			}
			utente.save(function(err){
				if (err) console.log(err);
				else res.redirect("/wishlist");
			});
			console.log(utente.wishlist);
		}
	});
});

app.post("/catalog/:id/recensioni", isLoggedIn, function(req,res){
	res.render('recensione.ejs', {idProdottoSent: req.body.prodottoRecensione});
});

app.get('/wishlist', isLoggedIn, function(req, res){
	Utente.findById(req.user._id).populate({path: 'wishlist'}).exec(function(err, utente){
		res.render('Wishlist.ejs', { elementi: utente.wishlist });
	});
});

app.post('/eliminaProdottoWishlist/:id', isLoggedIn, function(req, res){
	Utente.findById(req.user._id).exec(function(err, utente){
		utente.wishlist.forEach(function(elemento){
			if (req.params.id == elemento){
				utente.wishlist.splice(utente.wishlist.indexOf(elemento), 1);
				utente.save(function(err){
					if (err) console.log(err);
					else res.redirect('/wishlist');
				});
			}
		});
	});
});

//REGISTRATION ROUTES
app.get('/register', function(req, res) {
	res.render('Registrazione.ejs');
});

app.post("/register", function(req, res) {
	var pass = req.body.password;
	var passRepeat = req.body.passwordRepeat;
	if (pass === passRepeat) {
		Utente.register(new Utente({
			username: req.body.username, 
			email: req.body.email, 
			carrello: [], 
			ordiniPassati: [],
			wishlist: [],
			}), pass, function(err, user){
			if(err){
				console.log(err);
				return res.render("Registrazione.ejs");
			}
			passport.authenticate("local")(req, res, function(){
				res.redirect("/userPage", { utente: req.user });
			});
		});
	} else {
		res.redirect("/register");
		console.log("Le password non coincidono");
	}
});

//LOGIN ROUTES
app.get('/login', function(req, res) {
	res.render('Accesso.ejs');
});

app.get('/userPage', isLoggedIn, function(req, res){
	if (req.user.admin){
		res.redirect('/admin')
	}else{
		Utente.findById(req.params.id, function(err, foundUtente){
			if(err){
				console.log(err);
			}else{
				res.render("userPage.ejs", {utente: req.user});
			}
		})
	}
});

app.post('/aggiornaInformazioniUtente', isLoggedIn, function(req, res){
	Utente.findById(req.user._id, function(err, utente){
		if (err) console.log(err);
		else {
			req.body.nome != undefined ? utente.nome = req.body.nome : utente.nome = utente.nome;
			req.body.cognome != undefined ? utente.cognome = req.body.cognome : utente.cognome = utente.cognome;
			req.body.dataNascita != undefined ? utente.dataNascita = req.body.dataNascita : utente.dataNascita = utente.dataNascita;
			req.body.indirizzo != undefined ? utente.indirizzo = req.body.indirizzo : utente.indirizzo = utente.indirizzo;
			req.body.cap != undefined ? utente.cap = req.body.cap : utente.cap = utente.cap;
			req.body.citta != undefined ? utente.citta = req.body.citta : utente.citta = utente.citta;
			req.body.numeroCarta != undefined ? utente.numeroCarta = req.body.numeroCarta : utente.numeroCarta = utente.numeroCarta;
		}
		utente.save(function(err){
			if (err) console.log (err);
		});
		console.log(req.user);
	});
	res.redirect('/userPage');
});

app.post("/login", login());
    
function login() {
	return function (req, res) {
		Utente.findOne({"username": req.body.username}, function (err, utente) {
			if (err){
				console.log(err);
				res.redirect("/login");
			}
			if(utente.admin){
				passport.authenticate("local")(req, res, function(){
					res.redirect("/admin");
				});
			} else {
				passport.authenticate("local")(req, res, function(){
					res.redirect("/");
				});
			}
		});
	}	
}


app.get("/logout", function(req, res){
	req.logOut();
	res.redirect("/");
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function isAdmin(req, res, next) {
	if(req.user.admin){
		return next();
	} else {
		res.redirect("/login");
	}
}

//ADMIN ROUTES and COMMANDS

app.get('/admin', isLoggedIn, isAdmin, function(req, res) {
	res.render('adminPage.ejs');
});

app.post("/adminInsertProduct", isAdmin, function (req, res){
	var today=new Date();
	Prodotto.create({
		nome: req.body.nome.toLowerCase(),
		nomeVisualizzato : req.body.nome,
		prezzo: req.body.prezzo,
		dataInserimento: today,
		prezzoScontato: req.body.prezzo,
		emailProduttore: req.body.emailProduttore,
		quantita: Number(req.body.quantita),
		descrizione: req.body.descrizione,
		immagine: req.body.immagine,
		votoMedio: 0,
		esaurito: Number(req.body.quantita) > 0 ? false : true,
		utentiInteressati: []
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

app.post("/adminProductManagement", isAdmin, function (req, res){
	var stringa = req.body.cerca.toLowerCase();
	var paroleChiave = stringa.split(" ");
	Prodotto.find({},function(err,tuttiiprodotti){
	if(err){
		console.log(err);
	}else{
		Prodotto.find({nome: null},function(err,arrayProdotti){
			tuttiiprodotti.forEach(function(item){
				paroleChiave.forEach(function(parolaChiave){
					var pos = item.nome.indexOf(parolaChiave);
					if(pos>=0){
						if(arrayProdotti.length<=0){
							arrayProdotti.push(item);
						}else{
							var trovato=false;
							arrayProdotti.forEach(function(oggetto){
								if(oggetto._id===item._id){
									trovato=true;
								}
							});
							if(trovato==false){
								arrayProdotti.push(item);
							}
						}
					}
				});
			});
			if(err){
				console.log(err);
				res.redirect('/admin');
			}else{
				if(arrayProdotti.length==0){
					console.log("Not Found");
					res.redirect('/admin');
				}else{
					res.render("itemManagement.ejs", { prodotti: arrayProdotti });
				}
			}
		});
	}
	});
});

app.get("*",function (req,res){
	res.send("Che cazzo ce stai a fa qua ao");
});

//per indicare su che porta deve ascoltare il server
app.listen(3000, function() {
	console.log("Connesso correttamente al server sulla porta 3000");
});