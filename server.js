var express = require("express");
var app = express();
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var cp = require("child_process");
var fs = require("fs");
var path = require('path');

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

app.use(express.static(__dirname + '/public')).use(cors()).use(cookieParser());

app.get("/update", (req,res)=>{
	// cd "C:/Users/Michael Zhang/Desktop/notecardCreator"

	var source = "C:/Users/Michael Zhang/Desktop/notecardCreator/public/decks/";
	var target = "D:/michaelServer/public/decks/";

	function copyFileSync( source, target ) {

		var targetFile = target;
	
		// If target is a directory, a new file with the same name will be created
		if ( fs.existsSync( target ) ) {
			if ( fs.lstatSync( target ).isDirectory() ) {
				targetFile = path.join( target, path.basename( source ) );
			}
		}
	
		fs.writeFileSync(targetFile, fs.readFileSync(source));
	}
	
	function copyFolderRecursiveSync( source, target ) {
		var files = [];
	
		// Check if folder needs to be created or integrated
		var targetFolder = path.join( target, path.basename( source ) );
		if ( !fs.existsSync( targetFolder ) ) {
			fs.mkdirSync( targetFolder );
		}
	
		// Copy
		if ( fs.lstatSync( source ).isDirectory() ) {
			files = fs.readdirSync( source );
			files.forEach( function ( file ) {
				var curSource = path.join( source, file );
				if ( fs.lstatSync( curSource ).isDirectory() ) {
					copyFolderRecursiveSync( curSource, targetFolder );
				} else {
					copyFileSync( curSource, targetFolder );
				}
			} );
		}
	}

	function deleteDirRecursive(path) {
		if(fs.existsSync(path)) {
			fs.readdirSync(path).forEach(function(file){
				var curPath = path + "/" + file;
				if(fs.lstatSync(curPath).isDirectory()) { // recurse
					deleteDirRecursive(curPath);
				} else { // delete file
					try {
						fs.unlinkSync(curPath);
					} catch (e) {
						console.log(e);
					}
				}
			});
			if(path!==target){
				try{
					fs.rmdirSync(path);
				} catch (err){
					console.log(err)
				}
			}
		}
	}

	deleteDirRecursive(target);
	copyFolderRecursiveSync(source, target);

	//use cmd to update heroku
	var execCmd = function (cmd, args){
		var process = cp.spawn(cmd, args);
		process.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});
		process.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});
		return process;
	}
	/*
	.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
	*/
	//execCmd("D:").on('close', (code) => {
		//console.log(`child process exited with code ${code}`);

		execCmd("cd", ["D:/michaelServer/"]).on('close', (code) => {
			console.log(`child process exited with code ${code}`);

			execCmd("git",["add","."]).on('close', (code) => {
				console.log(`child process exited with code ${code}`);
		
				execCmd("git",["commit","-m","\"notecard update by cmd\""]).on('close', (code) => {
					console.log(`child process exited with code ${code}`);
		
					execCmd("git",["push","herkou","master"]).on('close', (code) => {
						console.log(`child process exited with code ${code}`);

						execCmd("git",["push","github","master"]).on('close', (code) => {
							console.log(`child process exited with code ${code}`);
						});
					});
				});
			});
		});
	//});
	res.redirect("/deckViewer?updated=true");
})

app.get('/spotifyYt/login', function(req, res) {

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
			refresh_token: refresh_token
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

app.listen(PORT, ()=>{
	console.log("listening asdfsdf " + PORT)
})