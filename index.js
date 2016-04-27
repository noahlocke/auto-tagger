var express = require('express');
var app = express();
var shopifyAPI = require('shopify-node-api');
var newOrder;
var cityTag;
var stateTag;
var orderID;

var Shopify = new shopifyAPI({
	shop: 'kwee-jack-fish-co-llc', // MYSHOP.myshopify.com 
	shopify_api_key: '78987fdb8ac036c581546ad56512140c', // Your API key 
	access_token: '071455328b55cc0a95d08059ac882f65' // Your API password 
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index');
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


app.post('/auto-tagger', function (request, response) {
	response.sendStatus(200);
	newOrder = JSON.parse(request);
});

function checkVendor() {
	if (newOrder.line_items.vendor === "Madison Co-Op") {
		cityTag = "MADISON";
		stateTag = "WI";
	} else if (newOrder.line_items.vendor === "Lancaster Co-Op") {
		cityTag = "LANCASTER";
		stateTag = "PA";
	} else if (newOrder.line_items.vendor === "Altoona Co-Op") {
		cityTag = "ALTOONA";
		stateTag = "PA";
	} else if (newOrder.line_items.vendor === "Chambersburg Co-Op") {
		cityTag = "CHAMBERSBURG";
		stateTag = "PA";
	} else if (newOrder.line_items.vendor === "Billings Co-Op") {
		cityTag = "BILLINGS";
		stateTag = "MT";
	} else if (newOrder.line_items.vendor === "Salt Lake City Co-Op") {
		cityTag = "SALT LAKE CITY";
		stateTag = "UT";
	} 	
}

function getIDs() {
	 orderID = newOrder.id;
	 customerID = newOrder.customer.id;
}

function tagCustomer() {
	 var newURL = "\/admin\/customers\/" + customerID + ".json";
	 var locationTag = cityTag + ", " + stateTag;
	 var put_data = {
	 	"customer": {
	 		"id": customerID,
	 		"tags": locationTag
	 	}
	 }
	 Shopify.put(newURL, put_data, function(err, data, headers){
  		console.log(data);
	});
}

function tagOrder() {
	 var newURL = "\/admin\/orders\/" + orderID + ".json";
	 var locationTag = cityTag + ", " + stateTag;
	 var put_data = {
	 	"order": {
	 		"id": orderID,
	 		"tags": locationTag
	 	}
	 }
	 Shopify.put(newURL, put_data, function(err, data, headers){
  		console.log(data);
	});
}

function autoTagger() {
	checkVendor();
	getIDs();
	tagCustomer();
	tagOrder();
}
