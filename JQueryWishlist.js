
var wish_list = new Array();

// controlla se il prodotto è nella wishlist oppure no.
 
if(jQuery.inArray($product_id,wish_list)==-1){ 

//se il prodotto non è presente lo aggiungiamo alla wishlist. Se risulterà falso non succede nulla.

$product_str = "<tr class='wishlist-item' id='list_id_"+$product_id+"'><td class='w-pname'>"+$product_name+"</td><td class='w-price'>$ "+$prduct_price+"</td><td class='w-premove' wpid='"+$product_id+"'>x</td></tr>";
jQuery("#wish_list_item").append($product_str);     
wish_list.push($product_id);
show_message("Prodotto aggiunto");
count_items_in_wishlist_update();
}


// aggiungamo una funzione per contare gli elementi della wishlist e aggiornarli.

function count_items_in_wishlist_update(){

    jQuery("#listitem").html(wish_list.length);
    if(wish_list.length>1){
    jQuery("#p_label").html("Prodotti");
    }
    else{
    jQuery("#p_label").html("Prodotto");
    } 
    }

// sviluppo della funzione per rimuovere un prodotto dalla wishlist.


jQuery("#wish_list_item").on("click",".w-premove",function(){
$product_id = jQuery(this).attr("wpid");
jQuery("#list_id_"+$product_id).remove();
wish_list = jQuery.grep( wish_list, function( n, i ) {
return n != $product_id;
});
show_message("Prodotto rimosso");
count_items_in_wishlist_update();
});
