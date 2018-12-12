var express = require('express');
var app = express();
var Client = require('node-rest-client').Client;
const utf8 = require('utf8');
var fs = require('fs');
var indexhtml = fs.readFileSync('./index.html');
var otpdatahtml = fs.readFileSync('./otpdata.html');
 
var client = new Client();

var client_id = '';
var client_secret = '';
var catalog = '';
var redirect_uri = '';
var scope = '';
var response_type = '';
var code = '';

app.use(express.static('.'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function (req, res) {
    res.write(indexhtml);
}); 

app.get('/otpdata', function (req, res) {
    res.write(otpdatahtml);
	res.end();
}); 

app.get('/guardardatos', function(req, res) {
	client_id = req.query.client_id;
	client_secret = req.query.client_secret;
	catalog = req.query.catalog;
	redirect_uri = req.query.redirect_uri;
	scope = req.query.scope;
	response_type = req.query.response_type;
	res.send('Datos almacenados en server');
});

app.get('/generartoken', function(req, res) {
	var authorization = client_id+":"+client_secret;
	var encodedauth = new Buffer(authorization).toString('base64');
	
	var args = {
		parameters: {
			grant_type: "authorization_code",
			code: code,
			redirect_uri: redirect_uri,
			scope: scope
		},
		headers: {
			"accept":"application/json",
			"apim-debug":"true",
			"content-type":"application/x-www-form-urlencoded",
			"authorization":"Basic "+encodedauth
		}
	};
	
	try{		
		client.post('https://api.us.apiconnect.ibmcloud.com/bancolombiabluemix-dev/'+catalog+'/hackathon/v1/security/oauth-otp/oauth2/token', args, function (data, response) {
			res.send('<div> <style media="screen" type="text/css">.container-code{width:100%;margin-top:150px;text-align:center;position:relative;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}.container-code>div>div:nth-child(1)>span{color:#df001e;font-weight:700;font-size:20px}p{width:800px;height:70px;display:inline-block;word-wrap:break-word}.oauth-button{text-decoration:none!important;border-radius:4px;color:#fff;border-color:#005296;cursor:pointer;background-image:none;border:0;padding:17px 28px;font-size:15px;margin:0 5px}.oauth-button-blue{background-color:#00418b;box-shadow:0 0 20px #00418b}</style> <div class="container-code"> <div> <div> <span>Token code</span> </div> <p>'+data.access_token+'</p> <form> <div> <a href="/" class="oauth-button oauth-button-blue"> Go to home</a> </div> </form> </div> </div> </div>');
		});
	}
	catch(e){
		console.log(e);
	}
});

app.get('/getaccesscode', function(req, res) {
	code = req.query.code;
	res.setHeader('content-type', 'text/html; charset=utf-8');
	res.send('<div><style media="screen" type="text/css">.container-code{height: 70vh;display: flex;align-items: center;justify-content: center;}.container-code > div{display: flex;flex-direction: column;align-items: center;margin: 0px 100px !important;}.container-code > div > div:nth-child(1) > span{color: #df001e;font-weight: 700;font-size:20px;}.container-code > div > div:nth-child(2) > p{text-align:center;}.container-code > div > div{margin: 5px 0px;}.container-code > div > form{margin: 15px 0px;}.oauth-button {text-decoration: none !important;border-radius: 4px;color: #fff;border-color: #005296;cursor: pointer;background-image: none;border: none;padding: 17px 28px;font-size: 15px;margin: 0px 5px;}.oauth-button-blue{background-color: #00418b;box-shadow: 0 0 20px #00418b;}</style><div class="container-code"><div><div><span>Authorization code</span></div><div><p>'+code+'</p></div><form action=/generartoken><button class="oauth-button oauth-button-blue">Generar Token</button></form></div></div></div>');
});

app.listen(3000, function() {
  console.log('Aplicación escuchando el puerto 3000!');
});