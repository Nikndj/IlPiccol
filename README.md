# IlPiccol
Best site of stupid offers
Sito di e-commerce sviluppato per il corso di Programmazione Web, coorte 2015-2016

[Deploy su Heroku](https://ilpiccol.herokuapp.com/)
[Video su YouTube](https://youtu.be/qK2cilvYpR4)

## Strumentazione
Di seguito la strumentazione usata per il sito:
- Node.js
- MongoDB
- Express
- Passport
- Bootstrap

## USER STORIES
1) Come admin voglio poter accedere ad un’area privata tramite username e password;
2) Come admin voglio gestire le rimanenze e i re-ordini dei prodotti;
3) Il server deve inviare una email all’admin quando sta per terminare un prodotto; 
4) Come admin voglio poter creare e inserire un nuovo prodotto (con proprietà come nome, descrizione, peso, ecc.); 
5) Come user voglio essere avvertito quando un prodotto terminato, risulta nuovamente disponibile;
6) Come utente voglio poter modificare gli articoli nel mio carrello;
7) Come utente voglio poter fare una ricerca dei prodotti e ordinarli in base a vari parametri; 
8) Come utente voglio poter aggiungere prodotti ad una wishlist; 
9) Come utente voglio poter vedere gli ultimi articoli aggiunti; 
10) Come utente voglio poter lasciare feedback e voti e poter ordinare gli articoli in base al voto;

## Struttura della cartella:

     IlPiccol
     |               
     +---models  /* modelli per il DB */
     |        \___ ordini.js
     |        \___ prodotti.js
     |        \___ utenti.js
     |
     +---node_modules /* contenitore di tutti i modelli e i pacchetti della strumentazione */
     |
     +---public /* cartella con file e oggetti pubblici */
     |        |
     |        +---Css
     |              \___ Accesso.css
     |              \___ Carrello.css
     |              \___ Catalogo.css
     |              \___ Homepage.css
     |              \___ Registrazione.css
     |              \___ style.css
     |        +---Immagini
     |        \___ modificaQuantita.js
     |
     +---views /*contenitore di tutti i file ejs */
     |       |
     |       +---partials
     |                  \___ footer.ejs
     |                  \___ header.ejs
     |                   \___ navbar.ejs
     |       \___ Accesso.ejs
     |       \___ adminPage.ejs
     |       \___ Carrello.ejs
     |       \___ Catalogo.ejs
     |       \___ Checkout.ejs
     |       \___ Contatti.ejs
     |       \___ Homepage.ejs
     |       \___ Item.ejs
     |       \___ itemManagement.ejs
     |       \___ NotFound.ejs
     |       \___ recensione.ejs
     |       \___ Registrazione.ejs
     |       \___ RisultatiRicerca.ejs
     |       \___ secret.ejs
     |       \___ StoricoOrdini.ejs
     |       \___ Supporto.ejs
     |       \___ userPage.ejs
     |       \___ Wishlist.ejs
     \___ app.js
     \___ mailsender.js
     \___ mongo.bat
     \___ mongod.bat
     \___ package_lock.json
     \___ package.json
     \___ Query.js
     \___ README.md

## Per cominciare

Di seguito i passaggi da compiere:

    git clone https://github.com/Nikndj/IlPiccol
    cd ./IlPiccol
    npm install
    node app.js

L'app si trova su Heroku e il DB su mLab, ma per accedere da locale scrivere localhost:3000 sulla barra di ricerca

## Note finali

Per accedere come admin, le credenziali sono:
Username: admin
password: admin

Collaboratori:
Nicola Del Giudice 095163
Luigi Bucchicchio 095562
Leonardo Calamita 095119
Matteo Guardabassi 095565
