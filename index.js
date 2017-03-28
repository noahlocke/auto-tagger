var express = require('express');
var app = express();
var shopifyAPI = require('shopify-node-api');
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var newOrder;
var locationTag;
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


app.post('/auto-tagger', jsonParser, function (request, response) {
	response.sendStatus(200);
	newOrder = request.body;
	autoTagger();
});

app.post('/mc-add-location', urlencodedParser, function (request, response) {
	response.sendStatus(200);
	var userEmail = request.body.data[email];
	var userLocation = request.body.data[merges][GROUPINGS][0][groups];
	addLocation();
});

function checkVendor() {
	if (newOrder.line_items[0].title.includes("Madison")) {
		locationTag = "MADISON, WI";
	} else if (newOrder.line_items[0].title.includes("Lancaster")) {
		locationTag = "LANCASTER, PA";
	} else if (newOrder.line_items[0].title.includes("Altoona")) {
		locationTag = "ALTOONA, PA";
	} else if (newOrder.line_items[0].title.includes("Chambersburg")) {
		locationTag = "CHAMBERSBURG, PA";
	} else if (newOrder.line_items[0].title.includes("Billings")) {
		locationTag = "BILLINGS, MT";
	} else if (newOrder.line_items[0].title.includes("Florham")) {
		locationTag = "FLORHAM PARK, NJ";
	} 	
	console.log(locationTag);
}

function getIDs() {
	 orderID = newOrder.id;
	 customerID = newOrder.customer.id;
}

function tagCustomer() {
	 var newURL = "/admin/customers/" + customerID + ".json";
	 var put_data = {
	 	"customer": {
	 		"id": customerID,
	 		"tags": locationTag
	 	}
	 };
	 Shopify.put(newURL, put_data, function(err, data, headers){
	 	console.log(newURL+"\n");
		console.log(put_data+"\n");
  		console.log(data);
	});
	

}

function tagOrder() {
	 var newURL = "/admin/orders/" + orderID + ".json";
	 var put_data = {
	 	"order": {
	 		"id": orderID,
	 		"tags": locationTag
	 	}
	 };
	 Shopify.put(newURL, put_data, function(err, data, headers){
  		console.log(newURL+"\n");
		console.log(put_data+"\n");
		console.log(data);
	});

}

function autoTagger() {
	checkVendor();
	getIDs();
	tagCustomer();
	tagOrder();
}

function addLocation() {
	console.log(userEmail + " has the location of " + userLocation);
}


