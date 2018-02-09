//*******************************************************************************************
// ORDINARE SENZA FILTRI

//Ordinare tutti i Prodotti del catalogo in base al prezzo Crescente.
db.Prodotti.find({},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({PrezzoScontato:1})

//Ordinare tutti i Prodotti del catalogo in base al prezzo Decrescente.
db.Prodotti.find({},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({PrezzoScontato:-1})

//Ordinare tutti i Prodotti del catalogo in base al Nome Crescente
db.Prodotti.find({},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({nome:1})

//Ordinare tutti i Prodotti del catalogo in base al Nome Decrescente
db.Prodotti.find({},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({nome:-1})

//Ordinare tutti i Prodotti nel catalogo in base al Voto Crescente
db.Prodotti.find({},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({voto: 1})

//Ordinare tutti i Prodotti nel catalogo in base al Voto Decrescente
db.Prodotti.find({},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({voto: -1})

//*****************************************************************************************
// ORDINARE CON FILTRI

// req.body.NOME DELLA STRINGA OTTENUTA DAL FORM DI RICERCA.

//Trovare una corrispondenza di un username nella tabella Utenti.
db.Utenti.find({username: /^req.body.stringaRicerca$/i },{_id:0, username:1, email:1})

//Trovare una corrispondenza di una e-mail nella tabella Utenti
db.Utenti.find({email: /^req.body.stringaRicerca$/i },{_id:0, username:1, email: 1})

//Trovare una corrispondenza di una password nella tabella Utenti
db.Utenti.find({password: /^req.body.stringaRicerca$/i},{_id:0, username:1, email:1})

//Ricerca di un prodotto ordinata in base al prezzo Crescente.
db.Prodotti.find({nome:/req.body.stringaRicerca/i},{_id:0, nome:1, PrezzoScontanto:1}).sort({PrezzoScontato:1})

//Ricerca di un prodotto ordinata in base al prezzo Decrescente.
db.Prodotti.find({nome:/req.body.stringaRicerca/i},{_id:0, nome:1, PrezzoScontanto:1}).sort({PrezzoScontato:-1})

//Ricerca di un prodotto ordinata in base al Nome Crescente
db.Prodotti.find({nome:/req.body.stringaRicerca/i},{_id:0, nome:1, PrezzoScontanto:1}).sort({nome:1})

//Ricerca di un prodotto ordinata in base al Nome Decrescente
db.Prodotti.find({nome:/req.body.stringaRicerca/i},{_id:0, nome:1, PrezzoScontanto:1}).sort({nome:-1})

//Ricerca di un prodotto ordinata in base al Voto Crescente
db.Prodotti.find({nome:/req.body.stringaRicerca/i},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({voto: 1})

//Ricerca di un prodotto ordinata in base al Voto Crescente
db.Prodotti.find({nome:/req.body.stringaRicerca/i},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({voto: -1})

//*************************************************************************************************
// Ricerca Particolare, tramite creazione di un indice, più efficiente

// Creazione di un indice su un campo (in questo caso <nome>) della tabella in considerazione (in questo caso <Prodotti>)
db.Prodotti.createIndex({ nome: "text" })

//Ricerche sul database secondo quell'indice. Di base è Case Insensitive ed è un OR logico sulle parole chiave.
//link utile: https://docs.mongodb.com/manual/reference/operator/query/text/#examples

//prezzo Crescente
db.Prodotti.find({$text:{$search:"req.body.stringaRicerca"}},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({PrezzoScontato:1})

//prezzo Decrescente
db.Prodotti.find({$text:{$search:"req.body.stringaRicerca"}},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({PrezzoScontato:-1})

//Nome Crescente
db.Prodotti.find({$text:{$search:"req.body.stringaRicerca"}},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({nome:1})

//Nome Decrescente
db.Prodotti.find({$text:{$search:"req.body.stringaRicerca"}},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({nome: -1})

//Voto Crescente
db.Prodotti.find({$text:{$search:"req.body.stringaRicerca"}},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({Voto:1})

//Voto Decrescente
db.Prodotti.find({$text:{$search:"req.body.stringaRicerca"}},{_id:0, nome:1, prezzoScontato:1, voto:1}).sort({Voto:-1})
