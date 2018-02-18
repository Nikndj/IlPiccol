var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaOrdine = new Schema({
	"utente": { "type": Schema.Types.ObjectId, "ref": 'Utente' },
	"prodotti": [{
		 prodotto: {"type": Schema.Types.ObjectId, "ref": 'Prodotto'}, 
		 quantita: [Number] 
		}],
	"totale": Number,
	"data": Date
}, {usePushEach: true});

module.exports = mongoose.model('Ordine', schemaOrdine);