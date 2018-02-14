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
mongoose.connect('mongodb://localhost/ilpiccoldb', {useMongoClient: true});

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

app.get('/RisultatiRicerca', function(req,res){
	res.render('RisultatiRicerca.ejs');
})

app.get('/NotFound', function(req, res){
	res.render('NotFound.ejs');
})

app.get('/itemManagement',function(req,res){
	res.render('itemManagement.ejs');
})

app.post('/itemManagement', function(req,res){
	if(req.body.inputPrezzo=="null"){
		Prodotto.findByIdAndUpdate(req.body.idProdotto,{
			immagine:req.body.inputImmagine, dataInserimento: new Date()},function(err, prodottoDaAggiornare){
			if(err){
				console.log("Non è stato trovato")
				console.log(err);
				res.redirect('/admin');
			}else{
				console.log("E' stato aggiornato")
				console.log(prodottoDaAggiornare);
			}
		});
	}else{
	Prodotto.findByIdAndUpdate(req.body.idProdotto,{
		prezzoScontato:req.body.inputPrezzo, dataInserimento: new Date()},function(err, prodottoDaAggiornare){
		if(err){
			console.log("Non è stato trovato")
			console.log(err);
			res.redirect('/admin');
		}else{
			console.log("E' stato aggiornato")
			console.log(prodottoDaAggiornare);
		}
	});
    }
	res.redirect('/admin');
})

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
			})
	    }
	})	
});

app.get('/recensione',function(req,res){
	res.render('recensione.ejs');
})

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
				$addToSet: { commenti: {testo: recText, data: new Date(), autore: recUser, voto: recVote}}} ,
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
	})
})

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
			res.render("Item.ejs", {prodotti: foundProdotto});
		}
	});
});

app.post("/catalog/:id",function(req,res){
	if(req.isAuthenticated()){
	res.render('recensione.ejs', {idProdottoSent: req.body.prodottoRecensione})
	}else{
		res.redirect('/login');
	}
});

app.get('/secret', function(req, res) {
	res.render('secret.ejs');
});

//REGISTRATION ROUTES
app.get('/register', function(req, res) {
	res.render('Registrazione.ejs');
});

app.post("/register", function(req, res) {
	//req.body.nomeUtente
	var pass = req.body.password;
	var passRepeat = req.body.passwordRepeat;
	//req.body.email
	
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
				//res.redirect("/login");
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


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//ADMIN ROUTES and COMMANDS

app.get('/admin', function(req, res) {
	res.render('adminPage.ejs');
});

app.post("/adminCreate", function (req, res){
	var today=new Date();
	Prodotto.create({
		nome: req.body.nome.toLowerCase(),
		nomeVisualizzato : req.body.nome,
		prezzo: req.body.prezzo,
		dataInserimento: today,
		prezzoScontato: req.body.prezzo,
		emailProduttore: req.body.emailProduttore,
		quantita: req.body.quantita,
		descrizione: req.body.descrizione,
		immagine: req.body.immagine,
		votoMedio: 0,
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

app.post("/adminManagement", function (req, res){
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
			res.redirect('/admin');
			}else{
				if(arrayProdotti.length==0){
					console.log("Not Found");
					res.redirect('/admin');
				}else{
			res.render("itemManagement.ejs", { prodotti: arrayProdotti });
				}
			}
		})
	}
	})
});

app.get("*",function (req,res){
	res.send("Che cazzo ce stai a fa qua ao");
});

//per indicare su che porta deve ascoltare il server
app.listen(3000, function() {
	console.log("Connesso correttamente al server sulla porta 3000")});
