var express = require("express");
var app = express();
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var fs = require("fs");
var {google} = require('googleapis');
var webpush = require('web-push');
var {Client} = require("pg");

const PORT = process.env.PORT || "12232";

var client_id = 'dba5356ba91643569a1c3d516c91dcc0'; // Your client id
var client_secret = 'ff36185c433e4e11afe8b1a3baa089bf'; // Your secret
var redirect_uri = 'https://michaelzhangwebsite.herokuapp.com/spotifyYt/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public')).use(cors()).use(bodyParser());

var lastPlaylist = "";
app.get('/spotifyYt/login', function(req, res) {
	var shortUrl = req.url.substring(req.url.indexOf("?")+1);
	lastPlaylist=querystring.parse(shortUrl).playlistInfo;
	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	// your application requests authorization
	var scope = 'playlist-read-private';
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		})
	);
});

app.get('/spotifyYt/callback', function(req, res) {

// your application requests refresh and access tokens
// after checking the state parameter

var code = req.query.code || null;
var state = req.query.state || null;
var storedState = req.cookies ? req.cookies[stateKey] : null;

if (state === null || state !== storedState) {
	res.redirect('/spotifyYt/#' +
	querystring.stringify({
		error: 'state_mismatch'
	}));
} else {
	res.clearCookie(stateKey);
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {
	if (!error && response.statusCode === 200) {

		var access_token = body.access_token,
			refresh_token = body.refresh_token;

		res.redirect('/spotifyYt/app.html?' +
		querystring.stringify({
			access_token: access_token,
			refresh_token: refresh_token,
			playlistInfo: lastPlaylist
		}));
	} else {
		res.redirect('/spotifyYt/?' +
		querystring.stringify({
			error: 'invalid_token'
		}));
	}
	});
}
});

app.get('/spotifyYt/refresh_token', function(req, res) {

// requesting access token from refresh token
var refresh_token = req.query.refresh_token;
var authOptions = {
	url: 'https://accounts.spotify.com/api/token',
	headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
	form: {
	grant_type: 'refresh_token',
	refresh_token: refresh_token
	},
	json: true
};

request.post(authOptions, function(error, response, body) {
	if (!error && response.statusCode === 200) {
	var access_token = body.access_token;
	res.send({
		'access_token': access_token
	});
	}
});
});

app.get("/getDecks", (req, res)=>{
    var json = {
        files:""
    }
    json.files = fs.readdirSync("./public/decks");
    res.send(JSON.stringify(json));
})

app.get("/uploads/*", (req, res)=>{
    res.sendFile(__dirname+req.url.substring(req.url.indexOf("/uploads/")));
});

app.get("/favicon.png", (req,res)=>{
	res.sendFile(__dirname+"/favicon.png")
})
app.get("/sFavicon.png", (req,res)=>{
	res.sendFile(__dirname+"/sFavicon.png")
})
app.get("/sFavicon.jpg", (req,res)=>{
	res.sendFile(__dirname+"/sFavicon.jpg")
})
app.get("/amongClassIcon.png", (req,res)=>{
	res.sendFile(__dirname+"/amongClassIcon.png")
})

var oAuth2Client;
const SCOPES = ["https://www.googleapis.com/auth/classroom.courses.readonly", "https://www.googleapis.com/auth/classroom.coursework.me.readonly", "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly", "https://www.googleapis.com/auth/classroom.announcements.readonly"];

app.get("/classroom/login", (req,res)=>{
	const {client_secret, client_id, redirect_uris} = {"client_id":"964270111872-332f6vopavq4lr71hl2ifvel1fh6jpm2.apps.googleusercontent.com","project_id":"michaeltest-1","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["https://michaelzhangwebsite.herokuapp.com/classroom/callback/"]};
	oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	res.redirect(authUrl);
})
app.get("/classroom/callback", (req,res)=>{
	var code = decodeURI(req.query.code);
	oAuth2Client.getToken(code, (err, token) => {
		if (err) res.redirect("/classroom/app.html?err=Error%20retrieving%20access%20token%20",err);
		res.redirect("/classroom/app.html?"+querystring.stringify(token));
	});
});

const vapidKeys = {
	'publicKey':'BJInwFCwuXAY2BkzBJ5sqaeBdrsp_QY-QOwsw7c7XoZtTWXmkMF7Y3F31QElUFEVgtkrSo6xkwKA6paDThqJNWg',
	'privateKey':'dOrY1IFvLBDzyLV5vmN94JzkJUCo4XS9smw5bk5dZ80'
}

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
	  rejectUnauthorized: false
	}
});
  
client.connect();

const saveToDatabase = async subscription => {
	localStorage.setItem("savedSubscription",subscription);
	console.log("saved sub: " + subscription);
}

app.post('/save-subscription', async (req, res) => {
	const subscription = req.body;
	await saveToDatabase(subscription) //Method to save the subscription to Database
	res.json({ message: 'success' })
})

//setting our previously generated VAPID keys
webpush.setVapidDetails(
	'mailto:mzhang0213@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend='') => {
	webpush.sendNotification(subscription, dataToSend)
}
app.get('/send-notification', (req, res) => {
	const subscription = localStorage.getItem("savedSubscription"); //get subscription from your databse here.
	console.log("gotten sub: " + subscription);
	const message = 'Hello World'
	sendNotification(subscription, message)
	res.json({ message: 'message sent' })
})

app.listen(PORT, ()=>{
	console.log("listening asdfsdf " + PORT)
})