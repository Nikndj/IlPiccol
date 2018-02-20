var prezzi = document.getElementsByClassName("prezzo");
var quantita = document.getElementsByClassName("quantita");
var prezzoFinale = document.getElementById('prezzoFinale');

for (var k = 0; k < quantita.length; k++) {
	quantita[k].addEventListener('change', function(){
		
	});
}

prezzoFinale.innerHTML = totalUpdate();
prezzoFinale.innerHTML += ' €';
console.log(totalUpdate());

function totalUpdate() {
	var totale = 0;
	for (var i = 0; i < prezzi.length; i++) {
		totale += Number(prezzi[i].innerHTML) * quantita[i].value;
	}
	return totale;
}

console.log("ao");