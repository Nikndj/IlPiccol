var quantita = document.getElementById("quantita");
var bottone = document.getElementById("newQuantitaButton");
var input = document.getElementById("newQuantitaValue");

quantita.addEventListener("click", function() {
	quantita.classList.add("hidden");
	input.value = Number(quantita.innerHTML);
	input.classList.remove("hidden");
	bottone.classList.remove("hidden");
});

bottone.addEventListener("click", function() {
	quantita.classList.remove("hidden");
	input.classList.add("hidden");
	bottone.classList.add("hidden");
	quantita.innerHTML = input.value;
}); 

console.log("ao");
