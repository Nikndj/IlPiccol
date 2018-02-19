var prezzi = document.getElementByClassName("prezzo");
var quantita = document.getElementByClassName("quantita");
var prezzoFinale = document.getElementById('prezzoFinale');

for (var k = 0; k < quantita.length; k++) {
	quantita[i].addEventListener('change', function(){
		
	});
}

prezzoFinale.innerHTML = totalUpdate();
console.log(totalUpdate());

function totalUpdate() {
	var totale = 0;
	for (var i = 0; i < prezzi.length; i++) {
		totale += Number(prezzi[i].innerHTML) * quantita[i].value;
	}
	return totale;
}

console.log("ao");