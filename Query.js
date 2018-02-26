//*******************************************************************************************
// ORDINARE SENZA FILTRI

//Ordinare tutti i Prodotti del catalogo in base al prezzo Crescente.
Prodotti.find({},'nome prezzoScontato voto',function(err,result){}).sort({PrezzoScontato:1})

//Ordinare tutti i Prodotti del catalogo in base al prezzo Decrescente.
Prodotti.find({},'nome prezzoScontato voto',function(err,result){}).sort({PrezzoScontato:-1})

//Ordinare tutti i Prodotti del catalogo in base al Nome Crescente
Prodotti.find({},'nome prezzoScontato voto',function(err,result){}).sort({nome:1})

//Ordinare tutti i Prodotti del catalogo in base al Nome Decrescente
Prodotti.find({},'nome prezzoScontato voto',function(err,result){}).sort({nome:-1})

//Ordinare tutti i Prodotti nel catalogo in base al Voto Crescente
Prodotti.find({},'nome prezzoScontato voto',function(err,result){}).sort({voto: 1})

//Ordinare tutti i Prodotti nel catalogo in base al Voto Decrescente
Prodotti.find({},'nome prezzoScontato voto',function(err,result){}).sort({voto: -1})

//*****************************************************************************************
// ORDINARE CON FILTRI

// req.body.NOME DELLA STRINGA OTTENUTA DAL FORM DI RICERCA
// la parte della query con gli apici es. 'username email' sono i campi di proiezione.

//Trovare una corrispondenza di un username nella tabella Utenti.
Utente.find({username: /^req.body.stringaRicerca$/i },'username email',function(err,result){})

//Trovare una corrispondenza di una e-mail nella tabella Utenti
Utente.find({email: /^req.body.stringaRicerca$/i },'username email',function(err,result){})

//Trovare una corrispondenza di una password nella tabella Utenti
Utente.find({password: /^req.body.stringaRicerca$/i},'username email',function(err,result){})

//Ricerca di un prodotto ordinata in base al prezzo Crescente.
Prodotto.find({nome:/req.body.stringaRicerca/i},'username email',function(err,result){})

//Ricerca di un prodotto ordinata in base al prezzo Decrescente.
Prodotto.find({nome:/req.body.stringaRicerca/i},'username email',function(err,result){})

//Ricerca di un prodotto ordinata in base al Nome Crescente
Prodotto.find({nome:/req.body.stringaRicerca/i},'username email',function(err,result){})

//Ricerca di un prodotto ordinata in base al Nome Decrescente
Prodotto.find({nome:/req.body.stringaRicerca/i},'username email',function(err,result){}).sort({nome:-1})

//Ricerca di un prodotto ordinata in base al Voto Crescente
Prodotto.find({nome:/req.body.stringaRicerca/i},'username email',function(err,result){}).sort({voto: 1})

//Ricerca di un prodotto ordinata in base al Voto Crescente
Prodotto.find({nome:/req.body.stringaRicerca/i},'username email',function(err,result){}).sort({voto: -1})