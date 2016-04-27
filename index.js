var express = require('express');
var app = express();
var shopifyAPI = require('shopify-node-api');

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

app.get('/auto-tagger', function (request, response) {
	console.log(request);
});


var Shopify = new shopifyAPI({
	shop: 'kwee-jack-fish-co-llc', // MYSHOP.myshopify.com 
	shopify_api_key: '78987fdb8ac036c581546ad56512140c', // Your API key 
	access_token: '071455328b55cc0a95d08059ac882f65' // Your API password 
});


