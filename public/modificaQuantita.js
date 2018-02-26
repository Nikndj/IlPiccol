var prezzi = document.getElementsByClassName("prezzo");
var prezzoFinale = document.getElementById('prezzoFinale');
var quantita = document.getElementsByClassName('quantita');

prezzoFinale.innerHTML = totalUpdate();
prezzoFinale.innerHTML += ' €';

function totalUpdate() {
	var totale = 0;
	for (var i = 0; i < prezzi.length; i++) {
		totale += Number(prezzi[i].innerHTML);
	}
	return totale;
}