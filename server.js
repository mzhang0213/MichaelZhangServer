var express = require("express");
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var fs = require("fs");
var {google} = require('googleapis');
var cookieParser = require("cookie-parser");
const res = require("express/lib/response");
var bodyParser = require('body-parser');
var webpush = require('web-push');

/*
var {Client} = require("pg");
*/
const PORT = process.env.PORT || 12232;
var app = express();
app.use(express.static(__dirname + '/public')).use(cors()).use(cookieParser()).use(bodyParser.json({limit:"50mb"}));
console.log(process.env.HOST);
console.log()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mzhang0213:jIdggOURnfAJOROQ@heroku.qkcqp9r.mongodb.net/?retryWrites=true&w=majority";

// "mongodb+srv://mzhang0213:<db_password>@heroku.qkcqp9r.mongodb.net/?retryWrites=true&w=majority&appName=heroku"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const imDone = async function(){
	setTimeout(async function(){
		await client.close();
	},200)
}




//websocketing


//음악 퀴즈

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
/*
const io = new Server(httpServer, {    }); //options



var dowebsocketstuff = function(){

console.log("doing web socket stuff");

io.on("connection", (socket) => {
	console.log(`connected with transport ${socket.conn.transport.name}`);
  
	socket.conn.on("upgrade", (transport) => {
	  console.log(`transport upgraded to ${transport.name}`);
	});
  
	socket.on("disconnect", (reason) => {
	  console.log(`disconnected due to ${reason}`);
	});

	socket.on("mod-mod_code",(body)=>{
		io.emit("client-mod_code",body);
	});

	socket.on("client-code_response",(body)=>{
		io.to(body.modId).emit("mod-code_response",body);
	})

	socket.on("client-가자",(body)=>{
		io.to(body.modId).emit("client-가자",body);
	})
});

}

*/




//proxying


// include dependencies
const { createProxyMiddleware } = require('http-proxy-middleware');

// proxy middleware options
/** @type {import('http-proxy-middleware/dist/types').Options} */
/*
const options = {
  target: 'https://instagram.com/direct/inbox/', // target host
  changeOrigin: false, // needed for virtual hosted sites
  ws: true, // proxy websockets
  ignorePath:true,
  
  pathRewrite: {
    '^/api/old-path': '/api/new-path', // rewrite path
    '^/api/remove/path': '/path', // remove base path
  },
  router: {
    // when request.headers.host == 'dev.localhost:3000',
    // override target 'http://www.example.org' to 'http://localhost:8000'
    'michaelzhangwebsite.herokuapp.com': 'https://instagram.com/direct/inbox',
  }
};

// create the proxy (without context)
const exampleProxy = createProxyMiddleware(options);

// mount `exampleProxy` in web server
app.use('/prox', exampleProxy);

*/







// BOBABYTE PLATFORM - generalized to "platform"

//create the frameworks for websocket connection to work
const server = createServer(app);
const io = new Server(httpServer, { /* options */ });

var bobabytewebsocket = function(){

console.log("doing web socket stuff");

//instantiating websocket with events
io.on("connection", (socket) => {
	console.log(`connected with transport ${socket.conn.transport.name}`);
  
	socket.conn.on("upgrade", (transport) => {
	  console.log(`transport upgraded to ${transport.name}`);
	});
  
	socket.on("disconnect", (reason) => {
	  console.log(`disconnected due to ${reason}`);
	});

	socket.on("testMessage", (body)=>{
		console.log(body);
	})
});


}
app.get("/sendSuperSecretMessage",(req,res)=>{
	io.emit("messageBack","this is message from sorvor");
	io.emit("messageBack",{"안녕":"하세요"});
	res.send("pog");
})

//name of database in mongodb
const hackDbName = "bobabyte2024";


/**
 * Creates a new user given a list [req.body.names]
 * containing objects that list first and last name.
 */
/* req.body.names:
[
	{
		first:"Michael",
		last:"Jang"
	},
	{}
]
*/
app.post("/platform-newUser", async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("accounts");
			const currContent = await db.findOne();
			const users = currContent.usernames;
		
			var found=-1; //holds group id if found, else -1 (bad code, bad variable purpose, idc)
			var submit = users;
			var msg = {
				error:0
			}
			for (var i=0;i<req.body.names.length;i++){
				var newUser = req.body.names[i];
				if(req.body.names[i].user===undefined||req.body.names[i].user===null||req.body.names[i].user===""){
					var newName = (req.body.names[i].first.charAt(0)+req.body.names[i].last.charAt(0)).toLowerCase();
					for (var j=0;j<5;j++)newName+=Math.floor(Math.random()*10);
					newUser.user = newName;
				}
				submit.push(newUser);
			}
			const filter = {title:"accounts"}
			const updateDoc = {
				$set: {
					usernames:submit
				}
			}
			await db.updateOne(filter,updateDoc);
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Given username submission, lets the client
 * know that username is good and that login
 * is successful
 */
//req.body.user is the username submitted
app.post("/platform-login", async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("accounts");
			const currContent = await db.findOne();
			const usernames = currContent.usernames;
		
			var found=false;
			var msg = {
				error:0
			}
			for (var i=0;i<usernames.length;i++){
				if (req.body.user==usernames[i].user){
					//usernames[i] is the correct registered username
					msg.user=usernames[i].user;
					msg.first=usernames[i].first;
					msg.last=usernames[i].last;
					found=true;
				}
			}
			if (!found){
				msg.error=1;
				console.log("toast");
			}
			res.send(JSON.stringify(msg))
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Given username submission, lets the client
 * know that username is good and that login
 * is successful
 * We let the client know using body.error
 */
//req.body.user is the username submitted
app.post("/platform-staff-login", async (req,res)=>{
	async function run(){
			try{
			await client.connect();
			const db = client.db(hackDbName).collection("accounts");
			const currContent = await db.findOne();
			const staff = currContent.staff;
		
			var found=false;
			var msg = {
				error:0
			}
			for (var i=0;i<staff.length;i++){
				if (req.body.user==staff[i]){
					found=true;
					break;
				}
			}
			if (!found){
				msg.error=1;
				console.log("toast");
			}
			res.send(JSON.stringify(msg))
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/*
groups are stored in an array
a single group's schematic:
{
	group:"group_name"
	id:"######" //6 random numbers
	members:[<usernames>]
}
*/
/**
 * Reads the current groups to see if
 * [req.body.group] exists in the database
 * already. If so, add [req.body.user] to
 * the group and update database. If not,
 * respond to client asking if the submitted
 * group name is correct.
 */
//req.body.group is the username submitted, req.body.user is the user's username
app.post("/platform-glogin", async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("accounts");
			const currContent = await db.findOne();
			const groups = currContent.groups;
		
			var found=-1; //holds group id if found, else -1 (bad code, bad variable purpose, idc)
			var submit = [];
			var msg = {
				error:0
			}
			for (var i=0;i<groups.length;i++){
				if (req.body.group===groups[i].group){
					found=groups[i].id;
					groups[i].members.push(req.body.user);
				}
				submit.push(groups[i]);
			}
			//얼마든지 맞아줄게
			console.log(submit);
			if (found!==-1){
				const filter = {title:"accounts"}
				const updateDoc = {
					$set: {
						groups:submit
					}
				}
				await db.updateOne(filter,updateDoc);
			}else {
				//new group, but i want to send confirmation that they are creating new group
				msg.error=1;
			}
			msg.group=req.body.group;
			msg.id=found;
			msg.user=req.body.user;
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Create a new group in database with the
 * given [req.body.user] as the first member
 * in the group, named [req.body.group]. Creates
 * the group with a random ID.
 */
//req.body.group, req.body.user
app.post("/platform-glogin-confirm", async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("accounts");
			const currContent = await db.findOne();
			const groups = currContent.groups;
			var submit = groups;
			var randomName = (Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+"";
			var members = [req.body.user];
			var currGroup = {
				group:req.body.group, //gname
				id:randomName, //random name
				members:members
			}
			submit.push(currGroup);
			const filter = {title:"accounts"}
			const updateDoc = {
				$set: {
					groups:submit
				}
			}
			await db.updateOne(filter,updateDoc);
			var msg = {
				group:req.body.group,
				id:randomName
			}
			res.send(JSON.stringify(msg))
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Given [req.body.user] and [req.body.id],
 * removes the given user from the group.
 * 
 * IF the user is the last member in the group,
 * the group is completely deleted
 * 
 * On client-side, this method should only be
 * able to be properly used by client who is
 * actually in the group (using [req.body.id]
 * which is not readily accessible to client)
 */
//req.body.user req.body.id
app.post("/platform-removeGroup", async (req,res)=>{
	async function run(){
		try{
			var msg = {
				error:0
			}
			await client.connect();
			const db_accs = client.db(hackDbName).collection("accounts");
			const currContent_groups = await db_accs.findOne();
			const groups = currContent_groups.groups;
			var submit = [];
			for (var i=0;i<groups.length;i++){
				var dont=false
				if (groups[i].id===req.body.id){
					//found the correct group, now remove user
					var newMembers = []
					for (var j=0;j<groups[i].members.length;j++){
						if (groups[i].members[j]!==req.body.user){
							newMembers.push(groups[i].members[j]);
						}
					}
					if (newMembers.length===0){
						//well now there are no group members; don't push this group back into storage
						dont=true;
					}else{
						groups[i].members=newMembers;
					}
				}else{
					submit.push(groups[i]);
				}
				if (!dont) submit.push(groups[i]);
			}
			const filter = {title:"accounts"}
			const updateDoc = {
				$set: {
					groups:submit
				}
			}
			await db_accs.updateOne(filter,updateDoc);
			res.send(JSON.stringify(msg))
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})


/* db.voting
	groups: [
		{
			id:"group_id",
			votes:[
				{
					user: "username",
					category: 1|2|3 <integer>
				},
				{
					user: "username",
					category: 1|2|3 <integer>
				}
			] //easy use of votes.length to get total votes for a group
		}
	],
	finals: [<same struc as above>]
*/
/*
req.body.votes: {
	1: ["groupid","groupid"],
	2: [],
	3: []
}
*/
/**
 * Given [req.body.user] and [req.body.votes: Set],
 * submits votes for the user. Goes through all
 * groups and updates user's newly intended votes.
 * If the user, for instance, changed their votes,
 * then a deletion would be made under one group and
 * addition to under another group.
 * This process is done to either the groups or finals
 * array, based on the round of voting occurring
*/
//req.body.user req.body.votes req.body.round
app.post("/platform-vote", async (req,res)=>{
	async function run(){
			try{
			await client.connect();
			const db = client.db(hackDbName).collection("voting");
			const currContent = await db.findOne();
			var allGroups = []; if (req.body.round==="groups")allGroups=currContent.groups; else allGroups=currContent.finals;
			//const userVotes = new Set(req.body.votes);
		
			var submit = [];
			var msg = {
				error:0
			}
			for (var i=0;i<allGroups.length;i++){
				//for all existing groups, try to find our user-casted vote
					//if we found it, we want to have our user-casted vote in allGroups[].votes
				//if you can't find it, then for this group re-create the group
				//EXCLUSIVELY WITHOUT the user's vote in there, whether it is there or not
				var found = false;
				var category = -1;
				for (key of Object.keys(req.body.votes)){
					var currCategory = new Set(req.body.votes[key]);
					if (currCategory.has(allGroups[i].id)){
						found = true;
						category = key;
						break;
					}
				}
				var updatedVotes = [];
				for (var j=0;j<allGroups[i].votes.length;j++){
					if (allGroups[i].votes[j].user!==req.body.user){
						updatedVotes.push(allGroups[i].votes[j]);
					}
				}
				if (found){
					//if we want the user-submitted vote to be in allGroups[].votes,
					//then lets create it and push it in!
					updatedVotes.push({
						"user":req.body.user,
						"category":category
					});
				}
				allGroups[i].votes=updatedVotes;
				submit.push(allGroups[i]);
			}
			
			//possible that allGroups has no groups instantiated
			//in that case, lets go thru all submitted votes and
			//see which voted-for groups need a new creation in
			//the database
			for (key of Object.keys(req.body.votes)){
				var currCategory = req.body.votes[key];
				for (var i=0;i<currCategory.length;i++){
					var found=false;
					//go thru submitted to see if they exist in db
					for (var j=0;j<allGroups.length;j++){
						if (currCategory[i]===allGroups[j].id){
							found=true;
							break;
						}
					}
					if (!found){
						//create a whole new vote profile for this group
						var newGroup = {};
						newGroup.id=currCategory[i];
						newGroup.votes=[{
							"user":req.body.user,
							"category":key
						}];
						submit.push(newGroup);
					}
				}
			}


			/*
			for (key of Object.keys(req.body.votes)){
				var currCategory = new Set(req.body.votes[key]);
				//looping through categories, each containing distinct votes
				//for each vote made by user,
				//try to find it in database and replace
				//-----
				//if not found, create a new vote profile
				//for that project in voting db
				var foundCategories = []; for (c of currCategory) foundCategories.push(false);
				for (var i=0;i<allGroups.length;i++){
					if (currCategory.has(allGroups[i].id)){
						//we found the right group
						//IE, EXPLICITLY: this curr group under this groupID
						//exists in the current category of votes we are
						//looping through
						var updatedVotes = [];
						for (var j=0;j<allGroups[i].votes.length;j++){
							if (allGroups[i].votes[j].user!==req.body.user){
								updatedVotes.push(allGroups[i].votes[j]);
							}
						}
						updatedVotes.push({
							"user":req.body.user,
							"category":key
						})
						allGroups[i].votes=updatedVotes;
						currCategory.delete(allGroups[i].id);
					}
					submit.push(allGroups[i]);
				}
				for (group of currCategory){
					//these guys are new, create new
					var newGroup = {};
					newGroup.id=group;
					newGroup.votes=[{
						"user":req.body.user,
						"category":key
					}];
					submit.push(newGroup);
				}
			}
			*/

			/*
			for (var i=0;i<votes.length;i++){
				var updatedVotes = [];
				for (var j=0;j<votes[i].votes.length;j++){
					if (votes[i].votes[j]!==req.body.user){
						updatedVotes.push(votes[i].votes[j]);
					}
				}
				if (userVotes.has(votes[i])){
					updatedVotes.push(req.body.user);
				}
				submit.push(votes[i]);
			}
			*/

			const filter = {title:"voting"}
			var updateDoc = {}
			if (req.body.round==="groups"){
				updateDoc={
					$set: {
						groups:submit
					}
				}
			}else{
				updateDoc={
					$set: {
						finals:submit
					}
				}
			}
			await db.updateOne(filter,updateDoc);
			res.send(JSON.stringify(msg))
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Creates a new project in database
 * with the given the project data.
 */
/* db.projects = [
	{
		projName:"poggers",
		groupName:"epic team",
		groupMembers:["Michael Zhang", "Bob Smith"],
		id:12345,
		projDesc:"epic description",
		mediaLink:"bobabyte.org"
	},
	{},,,,,,,
]
*/
/*
data: (req.body.xxx)
	projName
	groupId
	projDesc
	mediaLink
*/
app.post("/platform-proj", async (req,res)=>{
	async function run(){
		try{

			var msg = {
				error:0
			}
			await client.connect();
			const db = client.db(hackDbName).collection("projects");
			const currContent = await db.findOne();
			const projects = currContent.projects;
			var submit = [];
			var editing = false;
			for (var i=0;i<projects.length;i++){
				if (projects[i].id===req.body.id){
					//edited submission
					editing = true;
					projects[i].projName=req.body.projName
					projects[i].projDesc=req.body.projDesc
					projects[i].mediaLink=req.body.mediaLink
				}
				submit.push(projects[i]);
			}
			if (!editing) {
				var members = [];
				var groupId = "";
				const db_accs = client.db(hackDbName).collection("accounts");
				const currContent_accs = await db_accs.findOne();
				const groups = currContent_accs.groups;
				const users = currContent_accs.usernames;
				console.log(groups);
				var found=false;
				for (var i=0;i<groups.length;i++){
					if (groups[i].id===req.body.id){
						//found the group
						found=true;
						members=groups[i].members;
						groupId=groups[i].id;
						break;
					}
				}
				if (!found){
					msg.error=1
				}else{
					var proj = {
						projName:req.body.projName,
						groupName:req.body.groupName,
						groupMembers:members,
						id:groupId,
						projDesc:req.body.projDesc,
						mediaLink:req.body.mediaLink
					}
					submit.push(proj);
				}
			}
			const filter = {title:"projects"}
			const updateDoc = {
				$set: {
					projects:submit
				}
			}
			await db.updateOne(filter,updateDoc);
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Makes an announcement in database title and body
 * and broadcasts the announcement to everyone
 */
app.post("/platform-anno", async(req,res)=>{
	async function run(){
		try {
			await client.connect();
			const db_annos = client.db(hackDbName).collection("annos");
			const currContent_annos = await db_annos.findOne();
			var annos_content = currContent_annos.annos;
			var submit = [];
			for (var i=0;i<annos_content.length;i++){
				submit.push(annos_content[i]);
			}
			var currAnno = {
				title:req.body.title,
				date:Date.now(),
				body:req.body.body
			}
			submit.push(currAnno);
	
			const filter = {title:"annos"}
			const updateDoc = {
				$set: {
					annos:submit
				}
			}
			await db_annos.updateOne(filter,updateDoc);
			var msg = {
				body:req.body.body
			}
	
			var message = {
				title:req.body.title,
				body:req.body.body
			};
			io.emit("platform-anno",message);
	
			res.send(JSON.stringify(msg))
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Gets the list of announcements in database
 */
app.get("/platform-getAnnos",async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("annos");
			const currContent = await db.findOne();
			var db_annos = currContent.annos;
			var msg = {
				annos:db_annos
			}
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Gets the total list of groups
 */
app.get("/platform-getGroups",async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("accounts");
			const currContent = await db.findOne();
			var db_groups = currContent.groups;
			var msg = {
				groups:db_groups
			}
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})


/*
body.members = [
	{
		user:"username",
		first:"bob",
		last:"smith"
	}
]
*/
/**
 * Gets the members of a group given
 * the id of a group
 * Also includes the group name
 */
//req.body.id
app.post("/platform-getMembers",async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("accounts");
			const currContent = await db.findOne();
			var db_group = currContent.groups;
			var db_users = currContent.usernames;
			var msg = {
				error:0,
				members:[]
			}
			var found = false;
			var memberUsernames = [];
			for (var i=0;i<db_group.length;i++){
				if (db_group[i].id===req.body.id){
					//found the group, now ret members
					found = true;
					memberUsernames = db_group[i].members;
					msg.groupName = db_group[i].group;
				}
			}
			//add names into members
			console.log(memberUsernames);
			for (var i=0;i<memberUsernames.length;i++){
				for (var j=0;j<db_users.length;j++){
					if (memberUsernames[i]===db_users[j].user){
						msg.members.push(db_users[j]);
					}
				}
			}
			console.log(msg.members);
			if (!found){
				msg.error=1;
			}
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Gets all the projects in database
 */
app.get("/platform-getProjects",async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("projects");
			const currContent = await db.findOne();
			var db_proj = currContent.projects;
			var msg = {
				projects:db_proj
			}
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Return all votes from either groups or finals
 * phase of voting from [req.body.round]
 */
app.post("/platform-getVoting",async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("voting");
			const currContent = await db.findOne();
			var voting = []; if (req.body.round==="groups")voting=currContent.groups; else voting=currContent.finals;
			var msg = {
				voting:voting
			}
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * Given group id [req.body.id], return project
 * associated with that group.
 */
app.post("/platform-getMyProject",async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("projects");
			const currContent = await db.findOne();
			var msg = {
				error:-1
			}
			var projects = currContent.projects;
			for (var i=0;i<projects.length;i++){
				if (projects[i].id===req.body.id){
					//found
					msg.error=0;
					msg.project=projects[i];
				}
			}
			if(msg.error===-1)msg.error=1;
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/* db.voting
	groups: [
		{
			id:"group_id",
			votes:[
				"username1", "username2"
			] //easy use of votes.length to get total votes for a group
		}
	],
	finals: [<same struc as above>]
*/
/*
body.votes = {
	1: {
		["group id","group_id"]
	},
	2: {},
	3: {}
}
*/
/**
 * Given group user [req.body.user], return votes
 * that that the given user made from either groups
 * stage or finals stage, depending on [req.body.round]
 * Votes will contain a [groupId] and a [category]
 */
app.post("/platform-getMyVotes",async (req,res)=>{
	async function run(){
		try{
			await client.connect();
			const db = client.db(hackDbName).collection("voting");
			const currContent = await db.findOne();
			var msg = {}
			var votes = []; if (req.body.round==="groups")votes=currContent.groups; else votes=currContent.finals;
			var submit = {};
			for (var i=0;i<votes.length;i++){
				var found = -1;
				for (var j=0;j<votes[i].votes.length;j++){
					if (votes[i].votes[j].user===req.body.user){
						found=j;
					}
				}
				if (found!==-1){
					if (submit[votes[i].votes[found].category]===undefined){
						submit[votes[i].votes[found].category]=[]
					}
					submit[votes[i].votes[found].category].push(votes[i].id);
				}
			}
			msg.votes = submit;
			res.send(JSON.stringify(msg));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})


/**
 * When received, blast signal to users on /vote
 * and everywhere else that voting is turned off.
 * Clients will set localstorage to voting off.
 */
app.post("/platform-votingOff",async (req,res)=>{
	async function run(){
		try{
			console.log(req.body.votingStatus);
			io.emit("platform-votingOff",req.body.votingStatus);
			res.send(JSON.stringify({msg:"OK"}));
		}catch (error){
			console.log(error);
		}finally{
			await client.close();
		}
	}
	await run();
})

/**
 * docx
 */
/*
app.post("/platform-votingSwitch",async (req,res)=>{
//abandoning
})
*/
 

/**
 * docx
 */
/*
abandoning
app.post("/platform-votingDeadline",async (req,res)=>{
	try{
		(async function(){
			io.emit("votingDeadline",req.body.time);
			res.send(JSON.stringify(msg));
		})().then(async function(){
			await client.close();
		})
	}catch(e){
		console.log(e);
	}
})
*/




































//메모장
app.get("/mmj-getFolders",async(req,res)=>{
	//returns folderS WITH AN S
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			const cursor = db.find();
			var folders = [];
			for await (var doc of cursor){
				if (folders.indexOf(doc.folder)===-1){
					folders.push(doc.folder);
				}
			}
			msg.folders=folders;
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
app.post("/mmj-getFolder",async(req,res)=>{
	//req.body.folder, returns arr of notes in the folder
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			const cursor = db.find();
			var folder = [];
			for await (var doc of cursor){
				if (doc.folder===req.body.folder){
					var pDoc = {title:doc.title}; //push doc
					folder.push(pDoc);
				}
			}
			msg.folder=folder;
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
/* THIS METHOD IS ALL IN THE FRONTEND AND DOESNT EXIST AS A SERVER OPERATION
app.post("/mmj-newFolder",async(req,res)=>{
	var msg = {};
	//req.body.folder, creates folder with note inside
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			////////////////////////////////////
			msg = {
				"msg":"yay"
			}
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
*/
app.post("/mmj-deleteFolder",async(req,res)=>{
	//req.body.folder: deletes all notes inside folder!
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			const cursor = db.find();
			for await (var doc of cursor){
				if (doc.folder===req.body.folder){
					var filter = {title:doc.title};
					await db.deleteOne(filter);
				}
			}
			msg = {
				"msg":"yay"
			}
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
app.post("/mmj-newNote",async(req,res)=>{
	//req.body.title, req.body.folder, creates empty
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			await db.insertOne({
				title:req.body.title,
				folder:req.body.folder,
				note:""
			})
			msg = {
				"msg":"yay"
			}
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
app.post("/mmj-deleteNote",async(req,res)=>{
	//data: req.body.title
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			const filter = {title:req.body.title}
			await db.deleteOne(filter);
			msg = {
				"msg":"yay"
			}
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
app.post("/mmj-update",async(req,res)=>{
	//data: req.body.title, req.body.note
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			const filter = {title:req.body.title}
			const updateDoc = {
				$set: {
					note:req.body.note
				}
			}
			await db.updateOne(filter,updateDoc);
			msg = {
				"msg":"yay"
			}
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
app.post("/mmj-getNote",async (req,res)=>{
	//data: req.body.title
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			const cursor = db.find();
			for await (var doc of cursor){
				if (doc.title===req.body.title){
					msg.note=doc.note;
					msg.title=doc.title;
					break;
				}
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
app.get("/mmj-getBackup",async(req,res)=>{
	var msg = {};
	/*
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	ㅡㅇㅡㅇㅡㅇㅡㅇㅡㅇㅡㅇㅡㅇㅡㅇㅡ

	folder folder folder folder

	ㅡㅇㅡㅇㅡㅇㅡㅇㅡㅇㅡㅇㅡㅇㅡㅇㅡ
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


	· note · note · note · note · note ·
	shit
	shit

	· note · note · note · note · note ·
	shit
	shit

	· note · note · note · note · note ·
	shit
	shit
	<8x \n>
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
	*/
	try{
		(async function(){
			await client.connect();
			const db = client.db("mmj").collection("note");
			const cursor = db.find();
			var folders = {}
			for await (var doc of cursor){
				if (folders[doc.folder]===undefined){
					folders[doc.folder]=[];
				}
				folders[doc.folder].push(doc);
			}
			var sending = "";
			for (var folder of Object.keys(folders)){
				//make folder dividing pattern
				for (var i=0;i<30;i++) sending+="~";
				sending+="\n";
				for (var i=0;i<12;i++) sending+="ㅡㅇ";
				sending+="\n";
				sending+="\n";
				for (var i=0;i<30;i++) sending+=folder+" ";
				sending+="\n";
				sending+="\n";
				for (var i=0;i<12;i++) sending+="ㅡㅇ";
				sending+="\n";
				for (var i=0;i<30;i++) sending+="~";
				sending+="\n";
				sending+="\n\n";
				for (var note of folders[folder]){
					sending+="· "; for (var i=0;i<35;i++) sending+=note.title+" · ";
					sending+="\n";
					sending+=note.note;
					sending+="\n";
					sending+="\n";
				}
				sending+="\n";
				sending+="\n\n\n\n\n\n\n\n";
			}
			msg.backup=sending;
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})






//ET help

app.post("/et-tutor",async(req,res)=>{
	var msg = {}
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("tutors");
			/* GET FROM DB
			var docs = [];
			const cursor = db.find();
			(async function(){
				for await (var doc of cursor){
					docs.push(doc);
				}
			})().then()
			*/
			var doc = {
				user:req.body.user,
				first:req.body.first,
				last:req.body.last,
				grade:req.body.grade,
				school:req.body.school,
				image:req.body.image,
				subjects:req.body.subjects
			}
			await db.insertOne(doc);

			/*
			const db_online = client.db("ethelp").collection("online");
			var currContent = await db_online.findOne();
			var online = currContent.online;
			online.push({
				user:req.body.user,
				date:0
			});
			const filter = {title:"online"}
			const updateDoc = {
				$set: {
					online:online
				}
			}
			await db_online.updateOne(filter,updateDoc);
			*/

			msg.error=0;
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone()
		})
	}catch (e){
		console.log(e);
	}
})

app.post("/et-tutorLogin", async (req,res)=>{
	var msg = {};
	try{
		//req.body.user is the username submitted
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("tutors");
			var docs = [];
			const cursor = db.find();
			(async function(){
				for await (var doc of cursor){
					docs.push(doc);
				}
			})().then(async function(){
				var found=false;
				msg = {
					error:0
				}
				for (var i=0;i<docs.length;i++){
					if (req.body.user==docs[i].user){
						//usernames[i] is the correct registered username
						msg.tutor=docs[i];
						found=true;
					}
				}
				if (!found){
					msg.error=1;
					console.log("toast");
				}
				res.send(JSON.stringify(msg))
			}).then(async function(){
				imDone();
			})
		})()
	} catch(error) {
		// Ensures that the client will close when you finish/error
		console.log(error);
	}
})


app.get("/et-getTutors",async (req,res)=>{
	var msg = {
		tutors:[]
	};
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("tutors");
			var tutors = [];
			const cursor = db.find();
			(async function(){
				for await (var doc of cursor){
					var tutor = {
						user:doc.user
					}
					tutors.push(tutor);
				}
			})().then(async function(){
				msg.tutors=tutors;
				res.send(JSON.stringify(msg));
			})
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

app.post("/et-getTutor",async (req,res)=>{
	//tutor username at req.body.user, position of total online tutors is at req.body.i
	//BUG: TUTOR USERNAME IS LEADKED
	//soln: client asks for online tutors starting at i=0, we find the first one and then give to them along with req.body.i +1 .  make this return tutor's data but not their username.
	var msg = {
		tutor:{}
	};
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("tutors");
			const cursor = db.find();
			for await (var doc of cursor){
				if (doc.user===req.body.user){
					msg.tutor=doc;
					msg.id=req.body.id;
					break;
				}
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

const vapidKeys = {
	publicKey: 'BAgfYISTfBzr9lElR16BE2zQNkK5HImAZZuXyEwfkLkI1OipeQhKTjOeS8ExTr2eU2cLe9FLaNQssjcLbB29JtA',
	privateKey: 'O1h0LxLpV2GHPGEe9-OzdkYTF_c8u36FumMUWNqNZXs',
}
//setting our previously generated VAPID keys
webpush.setVapidDetails(
	'mailto:mzhang0213@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
	webpush.sendNotification(subscription, JSON.stringify(dataToSend))
}

app.post("/et-online",async (req,res)=>{
	var msg = {};
	try{
		//req.body.user is the username submitted
		(async function(){
			await client.connect();
			/*
			const db_online = client.db("ethelp").collection("online");
			var currContent = await db_online.findOne();
			var online = currContent.online;
			var updatedUser=-1;
			for (var i=0;i<online.length;i++){
				if (online[i].user===req.body.user){
					online[i].date=Date.now();
					updatedUser=i;
				}
			}
			const filter = {title:"online"}
			const updateDoc = {
				$set: {
					online:online
				}
			}
			await db_online.updateOne(filter,updateDoc);
			*/
			var updatedUser = {
				user:req.body.user,
				//date:Date.now()
			}
			const db_subs = client.db("ethelp").collection("subs");
			const currContent_subs = await db_subs.findOne();
			var subs_content = currContent_subs.subs;
			var message = {
				updatedUser:updatedUser,
				action:"online"
			};
			//make a timed for loop because this is stupid
			var loop = function(ind,message){
				if (ind<subs_content.length){
					sendNotification(subs_content[ind].sub,message);
					setTimeout(function(){
						loop(ind+1,message);
					},400);
				}
			}
			loop(0,message);
			res.send(JSON.stringify({error:0}))
		})().then(async function(){
			imDone();
		})
	} catch(error) {
		// Ensures that the client will close when you finish/error
		console.log(error);
	}
})

/*
app.post("/et-offline",async (req,res)=>{
	var msg = {};
	try{
		//req.body.user is the username submitted
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("online");
			var currContent = await db.findOne();
			var online = currContent.online;
			var newOnline = [];
			for (var i=0;i<online.length;i++){
				if (online[i]!==req.body.user){
					console.log("not the same = good");
				}else{
					console.log("found and destroyed offline person MWAHAHAHA jk thats mean user: "+req.body.user);
				}
			}
			const filter = {title:"online"}
			const updateDoc = {
				$set: {
					online:newOnline
				}
			}
			await db.updateOne(filter,updateDoc);

			const db_subs = client.db("ethelp").collection("subs");
			const currContent_subs = await db_subs.findOne();
			var subs_content = currContent_subs.subsUsers;
			var message = {
				online:newOnline
			};
			for (var i=0;i<subs_content.length;i++){
				//for each subscription, send noti
				sendNotification(subs_content[i].sub,message);
			}
			res.send(JSON.stringify({error:0}))
		})().then(async function(){
			imDone();
		})
	} catch(error) {
		// Ensures that the client will close when you finish/error
		console.log(error);
	}
})
*/

app.post("/et-save-sub",async(req,res)=>{
	try{
		(async function(){
			//data: req.body.user req.body.sub
			await client.connect();
			const db = client.db("ethelp").collection("subs");
			const currContent = await db.findOne();
			var db_subs = currContent.subs;
			var submit = [];
			for (var i=0;i<db_subs.length;i++){
				//found a sub that alr has a user
				//dont push the old sub back, update the it instead
				if (db_subs[i].user!==req.body.user){
					submit.push(db_subs[i]);
				}
			}
			var currSub = {
				user:req.body.user,
				sub:req.body.sub
			}
			submit.push(currSub);
			const filter = {title:"subs"}
			const updateDoc = {
				$set: {
					subs:submit
				}
			}
			await db.updateOne(filter,updateDoc);
			var msg = {
				"msg":"yay"
			}
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

app.post("/et-unregister",async(req,res)=>{
	try{
		(async function(){

			console.log(req.body);
			//data: req.body.user
			await client.connect();
			const db = client.db("ethelp").collection("subs");
			const currContent = await db.findOne();
			var db_subs = currContent.subs;
			var submit = [];
			for (var i=0;i<db_subs.length;i++){
				//found a sub that alr has a user
				//dont push the old sub back, update the it instead
				if (db_subs[i].user!==req.body.user && db_subs[i].user!==req.body.tutor){
					submit.push(db_subs[i]);
				}
			}
			const filter = {title:"subs"}
			const updateDoc = {
				$set: {
					subs:submit
				}
			}
			await db.updateOne(filter,updateDoc);
			var msg = {
				"msg":"yay"
			}
			res.send(JSON.stringify(msg))
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

app.post("/et-connect",async (req,res)=>{
	var msg = {};
	//posting tutor want to connect: req.body.tutor
	//posting message data: req.body.user, req.body.message, req.body.subjects  <<user data
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("subs");
			const currContent = await db.findOne();
			var db_subs = currContent.subs;
			//for all of the tutor sw subs, see which one is online and push to their worker that req has come in
			for (var i=0;i<db_subs.length;i++){
				if (db_subs[i].user===req.body.tutor){
					//found the tutor to push sub to that tutor's sw
					var request = {
						newRequest:{
							user:req.body.user,
							first:req.body.first,
							tutor:req.body.tutor,
							tutorName:req.body.tutorName,
							message:req.body.message,
							time:req.body.time,
							subjects:req.body.subjects
						},
						action:"connect"
					}
					msg.error=0;
					sendNotification(db_subs[i].sub,request);
					break;
				}
			}
			if (msg.error===undefined){
				msg.error=1;
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

var rndNum = (lo,hi)=>{
	return Math.floor(Math.random()*(hi+1))+lo;
}

app.post("/et-confirm",async (req,res)=>{
	var msg = {};
	//posting tutor want to connect: req.body.tutor
	//posting message data: req.body.user, req.body.message, req.body.subjects  <<user data
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("subs");
			const currContent = await db.findOne();
			var db_subs = currContent.subs;
			for (var i=0;i<db_subs.length;i++){
				if (db_subs[i].user===req.body.user){
					var chatId="";
					for (var j=0;j<10;j++)chatId+=rndNum(0,9);
					var request = {
						confirm:{
							user:req.body.user,
							first:req.body.first,
							tutor:req.body.tutor,
							tutorName:req.body.tutorName,
							message:req.body.message,
							time:req.body.time,
							subjects:req.body.subjects,
							chatId:chatId
						},
						action:"confirm"
					}
					msg.error=0;
					msg.chatId=chatId;
					sendNotification(db_subs[i].sub,request);
					break;
				}
			}
			if (msg.error===undefined){
				msg.error=1;
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})
/*
app.post("/et-addSw",async (req,res)=>{
	var msg = {};
	//updating sw registration at req.body.oldUser, adding in req.body.user
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("subs");
			const currContent = await db.findOne();
			var db_subs = currContent.subs;
			for (var i=0;i<db_subs.length;i++){
				if (db_subs[i].user===req.body.u){
					if (req.body.user!==undefined){
						db_subs[i].user=req.body.user;
						db_subs[i].tutor=req.body.u;
					}else if (req.body.tutor!==undefined){
						db_subs[i].user=req.body.u;
						db_subs[i].tutor=req.body.user;
					}else{
						console.log("wtf just happened")
					}
				}
			}
			msg.yay="woo";
			const filter = {title:"subs"}
			const updateDoc = {
				$set: {
					subs:db_subs
				}
			}
			await db.updateOne(filter,updateDoc);
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})*/

app.post("/et-text",async (req,res)=>{
	//req.body.user || req.body.tutor , req.body.text
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("subs");
			const currContent = await db.findOne();
			var db_subs = currContent.subs;
			for (var i=0;i<db_subs.length;i++){
				if (req.body.to==="user"&&db_subs[i].user===req.body.user){
					msg.error=0;
					var request = {
						text:{
							text:req.body.text
						},
						action:"text"
					}
					sendNotification(db_subs[i].sub,request);
					break;
				}else if (req.body.to==="tutor"&&db_subs[i].user===req.body.tutor){
					msg.error=0;
					var request = {
						text:{
							text:req.body.text
						},
						action:"text"
					}
					sendNotification(db_subs[i].sub,request);
					break;
				}
			}
			if (msg.error===undefined){
				msg.error=1;
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

app.post("/et-img",async (req,res)=>{
	//req.body.user || req.body.tutor , req.body.text
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db_img = client.db("ethelp").collection("img");
			const currContent_img = await db_img.findOne();
			var currImgs = currContent_img.img;
			var submit = [];
			for (var i of currImgs)submit.push(i);
			var id="";
			for (var j=0;j<10;j++)id+=rndNum(0,9);
			var currImg = {
				id:id,
				data:req.body.img
			}
			submit.push(currImg);
			const filter = {title:"img"}
			const updateDoc = {
				$set: {
					img:submit
				}
			}
			await db_img.updateOne(filter,updateDoc);

			const db = client.db("ethelp").collection("subs");
			const currContent = await db.findOne();
			var db_subs = currContent.subs;
			for (var i=0;i<db_subs.length;i++){
				if (req.body.to==="user"&&db_subs[i].user===req.body.user){
					msg.error=0;
					var request = {
						img:{
							img:id
						},
						action:"img"
					}
					sendNotification(db_subs[i].sub,request);
					break;
				}else if (req.body.to==="tutor"&&db_subs[i].user===req.body.tutor){
					msg.error=0;
					var request = {
						img:{
							img:id
						},
						action:"img"
					}
					sendNotification(db_subs[i].sub,request);
					break;
				}
			}
			if (msg.error===undefined){
				msg.error=1;
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

app.post("/et-getImg",async (req,res)=>{
	//tutor username at req.body.user, position of total online tutors is at req.body.i
	//BUG: TUTOR USERNAME IS LEADKED
	//soln: client asks for online tutors starting at i=0, we find the first one and then give to them along with req.body.i +1 .  make this return tutor's data but not their username.
	var msg = {
		img:-1
	};
	try{
		(async function(){
			await client.connect();
			const db_img = client.db("ethelp").collection("img");
			const currContent_img = await db_img.findOne();
			var currImgs = currContent_img.img;
			for (var i of currImgs){
				if (i.id===req.body.id){
					msg.img=i;
				}
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

app.post("/et-endSession",async (req,res)=>{
	//req.body.user || req.body.tutor , req.body.text
	var msg = {};
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("subs");
			const currContent = await db.findOne();
			var db_subs = currContent.subs;
			for (var i=0;i<db_subs.length;i++){
				console.log(db_subs[i].user);
				console.log("my targeT: "+req.body.user);
				if (req.body.to==="user"&&db_subs[i].user===req.body.user){
					msg.error=0;
					var request = {
						endSession:{
							id:req.body.id
						},
						action:"endSession"
					}
					sendNotification(db_subs[i].sub,request);
					break;
				}
			}
			if (msg.error===undefined){
				msg.error=1;
			}

			const db_img = client.db("ethelp").collection("img");
			const currContent_img = await db_img.findOne();
			var currImgs = currContent_img.img;
			var submit = []
			for (var i of currImgs){
				for (var j of req.body.img){
					if (i.id!==j){ //note: req.body.img contains img IDS
						//remove i by not pushing it in
						submit.push(i);
					}
				}
			}
			const filter = {title:"img"}
			const updateDoc = {
				$set: {
					img:submit
				}
			}
			await db_img.updateOne(filter,updateDoc);
			
			res.send(JSON.stringify(msg));
		})().then(async function(){
			imDone();
		})
	}catch (e){
		console.log(e);
	}
})

var path = require("path");

app.get("/ethelp/chat/*",(req,res)=>{
	res.sendFile(__dirname+"/public/ethelp/chat.html");
})

app.get("/ettutor/chat/*",(req,res)=>{
	res.sendFile(__dirname+"/public/ethelp/chat.html");
})







// HIPPO HACK








app.post("/hh-login", async (req,res)=>{
	try{
		//req.body.user is the username submitted
		(async function(){
			await client.connect();
			const db = client.db("hippohack2023").collection("accounts");
			const currContent = await db.findOne();
			const usernames = currContent.usernames;
		
			var found=false;
			var msg = {
				error:0
			}
			for (var i=0;i<usernames.length;i++){
				if (req.body.user==usernames[i].user){
					//usernames[i] is the correct registered username
					msg.user=usernames[i].user;
					msg.first=usernames[i].first;
					msg.last=usernames[i].last;
					found=true;
				}
			}
			if (!found){
				msg.error=1;
				console.log("toast");
			}
			res.send(JSON.stringify(msg))
		})().then(async function(){
			await client.close();
		})
	} catch(error) {
		// Ensures that the client will close when you finish/error
		console.log(error);
	}
})

app.post("/hh-glogin", async (req,res)=>{
	try{
		//req.body.group is the username submitted, req.body.user is the user's username
		/*
		  group schematic:
		  {
			group:"gname"
			user:"######" //6 random numbers
			members:[users]
		  }
		*/
		(async function(){
			await client.connect();
			const db = client.db("hippohack2023").collection("accounts");
			const currContent = await db.findOne();
			const groups = currContent.groups;
		
			var found=false;
			var submit = [];
			var msg = {
				error:0
			}
			for (var i=0;i<groups.length;i++){
				console.log("submitted gname: "+req.body.group);
				console.log("db gname: "+groups[i].group);
				if (req.body.group==groups[i].group){
					found=true;
					groups[i].members.push(req.body.user);
				}
				submit.push(groups[i])
			}
			if (found){
				const filter = {title:"usernames"}
				const updateDoc = {
					$set: {
						groups:submit
					}
				}
				await db.updateOne(filter,updateDoc);
				
			}else {
				//new group, but i want to send confirmation that they are creating new group
				msg.error=1;
			}
			msg.group=req.body.group;
			msg.user=req.body.user;
			res.send(JSON.stringify(msg))
		})().then(async function(){
			await client.close();
		})
	}catch (error){
		console.log(error);
	}
})

app.post("/hh-glogin-confirm", async (req,res)=>{
	//posted to req.body.confirm, req.body.group, req.body.user
	try{
		await client.connect();
		const db = client.db("hippohack2023").collection("accounts");
		const currContent = await db.findOne();
		const groups = currContent.groups;
		console.log(currContent)
		console.log(groups)
		var submit = [];
		for (var i=0;i<groups.length;i++){
			submit.push(groups[i])
		}
		var randomName = (Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+""+(Math.floor(Math.random()*10))+"";
		var members = [];
		members.push(req.body.user);
		var currGroup = {
			group:req.body.group, //gname
			user:randomName, //random name
			members:members
		}
		submit.push(currGroup);
		const filter = {title:"usernames"}
		const updateDoc = {
			$set: {
				groups:submit
			}
		}
		var msg = {
			group:req.body.group
		}
		await db.updateOne(filter,updateDoc);
		res.send(JSON.stringify(msg))

	}finally{
		await client.close();
	}
})

app.post("/hh-removeGroup", async (req,res)=>{
	try{
		//req.body.user req.body.group
		var msg = {
			error:0
		}
		await client.connect();
		const db_accs = client.db("hippohack2023").collection("accounts");
		const currContent_groups = await db_accs.findOne();
		const groups = currContent_groups.groups;
		var submit = [];
		for (var i=0;i<groups.length;i++){
			var dont=false
			if (groups[i].group===req.body.group){
				//found the correct group, now remove user
				var newMembers = []
				for (var j=0;j<groups[i].members.length;j++){
					if (groups[i].members[j]!==req.body.user){
						newMembers.push(groups[i].members[j]);
					}
				}
				if (newMembers.length===0){
					//well now there are no group members; don't push
					dont=true;
				}else{
					groups[i].members=newMembers;
				}
			}
			if (!dont) submit.push(groups[i]);
		}
		const filter = {title:"usernames"}
		const updateDoc = {
			$set: {
				groups:submit
			}
		}
		await db_accs.updateOne(filter,updateDoc);
		
		res.send(JSON.stringify(msg))

	}finally{
		await client.close();
	}
})

app.post("/hh-vote", async (req,res)=>{
	try{
		//req.body.user req.body.votes
		(async function(){

			await client.connect();
			const db = client.db("hippohack2023").collection("voting");
			//groupAVote groupBVote >> arrays
			const currContent = await db.findOne();
			const people = currContent.groups;
		
			var found=false;
			var submit = [];
			var msg = {
				error:0
			}
			for (var i=0;i<people.length;i++){
				if (req.body.user===people[i].user){
					//found user editing their vote
					found=true;
					people[i].votes=req.body.votes;
				}
				submit.push(people[i]);
			}
			if (!found){
				//new vote
				var vote = {
					user:req.body.user,
					votes:req.body.votes
				}
				submit.push(vote);
			}
			const filter = {title:"voting"}
			const updateDoc = {
				$set: {
					groups:submit
				}
			}
			await db_accs.updateOne(filter,updateDoc);
			res.send(JSON.stringify(msg))
		})().then(async function(){
			await client.close();
		})
	}catch (error){
		console.log(error);
	}
})

app.post("/hh-proj", async (req,res)=>{
	try{
		/*
		data: (req.body.xxx)
			projName
			groupName
			projDesc
			mediaLink
		*/
		(async function(){

			var msg = {
				error:0
			}
			await client.connect();
			const db = client.db("hippohack2023").collection("projects");
			const currContent = await db.findOne();
			const projects = currContent.projects;
			var submit = [];
			var editing = false;
			for (var i=0;i<projects.length;i++){
				if (projects[i].groupName===req.body.groupName){
					//edited submission
					editing = true;
					projects[i].projName=req.body.projName
					projects[i].projDesc=req.body.projDesc
					projects[i].mediaLink=req.body.mediaLink
				}
				submit.push(projects[i]);
			}
			var found=false;
			if (!editing) {
				var members = [];
				var groupId = "";
				const db_accs = client.db("hippohack2023").collection("accounts");
				const currContent_groups = await db_accs.findOne();
				const groups = currContent_groups.groups;
				console.log(groups);
				for (var i=0;i<groups.length;i++){
					if (groups[i].group===req.body.groupName){
						//found the group
						found=true;
						members=groups[i].members;
						groupId=groups[i].user;
					}
				}
				if (!found){
					msg.error=1
				}else{
					var members_str = "";
					for (var i=0;i<members.length;i++){
						members_str=members[i]+", ";
					}
					members_str=members_str.substring(0,members_str.length-2);
					var proj = {
						projName:req.body.projName,
						groupName:req.body.groupName,
						groupMembers:members_str,
						id:groupId,
						projDesc:req.body.projDesc,
						mediaLink:req.body.mediaLink
					}
					submit.push(proj);
				}
			}
			if(found){
				const filter = {title:"projects"}
				const updateDoc = {
					$set: {
						projects:submit
					}
				}
				await db.updateOne(filter,updateDoc);
			}
			
			res.send(JSON.stringify(msg));
		})().then(async function(){
			await client.close();
		})

	}catch(e){
		console.log(e)
	}
})

//NOTE: WEBPUSH DETAILS DEFINED ABOVE EALIER

app.post("/hh-anno", async(req,res)=>{
	try {
		
		await client.connect();
		const db_annos = client.db("hippohack2023").collection("annos");
		const currContent_annos = await db_annos.findOne();
		var annos_content = currContent_annos.annos;
		var submit = [];
		for (var i=0;i<annos_content.length;i++){
			submit.push(annos_content[i]);
		}
		var currAnno = {
			title:req.body.title,
			date:Date.now(),
			body:req.body.body
		}
		submit.push(currAnno);

		const filter = {title:"annos"}
		const updateDoc = {
			$set: {
				annos:submit
			}
		}
		await db_annos.updateOne(filter,updateDoc);
		var msg = {
			body:req.body.body
		}

		//service worker time
		// payload @ req.body.title req.body.body
		const db_subs = client.db("hippohack2023").collection("subs");
		const currContent_subs = await db_subs.findOne();
		var subs_content = currContent_subs.subs;
		var message = {
			title:req.body.title,
			body:req.body.body
		};
		for (var i=0;i<subs_content.length;i++){
			//for each subscription, send noti
			sendNotification(subs_content[i].sub,message);
		}

		res.send(JSON.stringify(msg))

	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
})

app.post("/hh-save-sub",async(req,res)=>{
	try{
		//data: req.body.user req.body.sub
		await client.connect();
		const db = client.db("hippohack2023").collection("subs");
		const currContent = await db.findOne();
		var db_subs = currContent.subs;
		var submit = [];
		for (var i=0;i<db_subs.length;i++){
			//found a sub that alr has a user
			//dont push the old sub back, update the it instead
			if (db_subs[i].user!==req.body.user){
				submit.push(db_subs[i]);
			}
		}
		var currSub = {
			user:req.body.user,
			sub:req.body.sub
		}
		submit.push(currSub);
		const filter = {title:"subs"}
		const updateDoc = {
			$set: {
				subs:submit
			}
		}
		await db.updateOne(filter,updateDoc);
		var msg = {
			"msg":"yay"
		}
		res.send(JSON.stringify(msg))
	}finally{
		await client.close();
	}
})

app.get("/hh-getAnnos",async (req,res)=>{
	try{
		await client.connect();
		const db = client.db("hippohack2023").collection("annos");
		const currContent = await db.findOne();
		var db_annos = currContent.annos;
		var msg = {
			annos:db_annos
		}
		res.send(JSON.stringify(msg));
	}finally{
		await client.close();
	}
})

app.post("/hh-getMembers",async (req,res)=>{
	//req.body.group
	try{
		(async function(){
			await client.connect();
			const db = client.db("hippohack2023").collection("accounts");
			const currContent = await db.findOne();
			var db_group = currContent.groups;
			var msg = {
				error:0
			}
			var found = false;
			for (var i=0;i<db_group.length;i++){
				if (db_group[i].group===req.body.group){
					//found the group, now ret members
					found = true;
					var msg = {
						members:db_group[i].members
					}
				}
			}
			if (!found){
				msg.error=1;
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			await client.close();
		})
	}catch (e){
		console.log(e);
	}
})

app.post("/hh-getMyGroup",async (req,res)=>{
	//req.body.group
	try{
		//get group a|b
		//get other group members
		await client.connect();
		const db = client.db("hippohack2023").collection("contest");
		const currContent = await db.findOne();
		var db_group = currContent.groups;
		console.log(currContent);
		var msg = {
			error:0
		}
		var otherMembers = [];
		var groupA = db_group.a; //array
		var groupB = db_group.b; //array
		var found = false;
		for (var i=0;i<groupA.length;i++){
			console.log(groupA[i].group, req.body.group)
			if (groupA[i].group===req.body.group){
				//found group do the tasks
				msg.group="a";
				found=true;
			}else {
				otherMembers.push(groupA[i])
			}
		}
		if (!found){
			otherMembers=[];
			for (var i=0;i<groupB.length;i++){
				console.log(groupA[i].group, req.body.group)
				if (groupB[i].group===req.body.group){
					//found group do the tasks
					msg.group="b";
					found=true;
				}else {
					otherMembers.push(groupB[i])
				}
			}
		}
		if (!found){
			msg.error=1;
		}else{
			msg.teams=otherMembers;
		}
		res.send(JSON.stringify(msg));
	}finally{
		await client.close();
	}
})

app.get("/hh-getProjects",async (req,res)=>{
	try{
		await client.connect();
		const db = client.db("hippohack2023").collection("projects");
		const currContent = await db.findOne();
		var db_proj = currContent.projects;
		var msg = {
			projects:db_proj
		}
		res.send(JSON.stringify(msg));
	}finally{
		await client.close();
	}
})








// SPOTIFY







app.get("/accounts", async (req,res)=>{
	try{
		await client.connect();
		const dbTracking = client.db("spotifyYt").collection("timeTrack");
		const result = await dbTracking.findOne();
		res.send(result);
	}finally{
		await client.close();
	}
})

const year = new Date().getUTCFullYear();
app.post("/updateTime", async (req,res)=>{
	try{ //find if im creating a whole new account and then if in a) old acc new device or not and b) new acc new device
		await client.connect();
		var theName = req.body.name;
		var theUpdatedDevice = req.body.updatedDevice;
		const dbTracking = client.db("spotifyYt").collection("timeTrack");
		const currContent = await dbTracking.findOne();
		const currAccs = currContent.accs;
		var submit = []
		var newAcc = true;
		console.log(currAccs,theName,theUpdatedDevice);
		for (var i=0;i<currAccs.length;i++){
			console.log("acc below")
			console.log(currAccs[i])
			if (theName===currAccs[i].name){
				//found old account that we are trying to update
				console.log("found old acc");
				var submitDevices = [];
				var newDevice = true;
				for (var j=0;j<currAccs[i].devices.length;j++){ //find if device alr exists >> old device being updated
					if (currAccs[i].devices[j].name===theUpdatedDevice.name){
						//device that is being updated
						console.log("found old acc and updating device");
						submitDevices.push(theUpdatedDevice);
						newDevice = false;
					}else{
						submitDevices.push(currAccs[i].devices[j]);
					}
				}
				if (newDevice){
					console.log("new device")
					submitDevices.push(theUpdatedDevice); //will be zeros
				}
				submit.push({
					name:theName,
					devices:submitDevices
				})
				newAcc=false;
			}else{
				submit.push(currAccs[i]);
			}
		}
		if (newAcc){
			//create new
			console.log("completely new acc")
			var devs = []
			devs.push(theUpdatedDevice);
			submit.push({
				name:theName,
				devices:devs //will be filled with zeros
			})
		}
		console.log("submit")
		console.log(submit)
		const filter = {title:"accounts"}
		const updateDoc = {
			$set: {
				accs:submit
			}
		}
		await dbTracking.updateOne(filter,updateDoc);
		var sendMsg = {
			accs:submit
		}
		res.send(JSON.stringify(sendMsg));
	}finally{
		await client.close();
	}
})

var client_id = 'dba5356ba91643569a1c3d516c91dcc0'; // Your client id
var client_secret = 'ff36185c433e4e11afe8b1a3baa089bf'; // Your secret

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
			redirect_uri: "https://"+req.hostname+'/spotifyYt/callback',
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
			redirect_uri: "https://"+req.hostname+'/spotifyYt/callback',
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


app.get('/musicQuiz/login', function(req, res) {
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
			redirect_uri: "https://"+req.hostname+'/musicQuiz/callback',
			state: state
		})
	);
});

app.get('/musicQuiz/callback', function(req, res) {

// your application requests refresh and access tokens
// after checking the state parameter

var code = req.query.code || null;
var state = req.query.state || null;
var storedState = req.cookies ? req.cookies[stateKey] : null;

if (state === null || state !== storedState) {
	res.redirect('/musicQuiz/#' +
	querystring.stringify({
		error: 'state_mismatch'
	}));
} else {
	res.clearCookie(stateKey);
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: "https://"+req.hostname+'/musicQuiz/callback',
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

		res.redirect('/musicQuiz/app.html?' +

		//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		//HERE IS WHERE CHANGE THE APP REDIR, CHANGE THIS IF WANT TO CHANGE THE SITE NAME LATA
		//HERE IS WHERE CHANGE THE APP REDIR, CHANGE THIS IF WANT TO CHANGE THE SITE NAME LATA
		//HERE IS WHERE CHANGE THE APP REDIR, CHANGE THIS IF WANT TO CHANGE THE SITE NAME LATA
		//HERE IS WHERE CHANGE THE APP REDIR, CHANGE THIS IF WANT TO CHANGE THE SITE NAME LATA

		querystring.stringify({
			access_token: access_token,
			refresh_token: refresh_token,
			playlistInfo: lastPlaylist
		}));
	} else {
		res.redirect('/musicQuiz/?' +
		querystring.stringify({
			error: 'invalid_token'
		}));
	}
	});
}
});

app.get('/musicQuiz/refresh_token', function(req, res) {

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
	const {client_secret, client_id, redirect_uris} = {"client_id":"964270111872-332f6vopavq4lr71hl2ifvel1fh6jpm2.apps.googleusercontent.com","project_id":"michaeltest-1","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["https://"+req.hostname+"/classroom/callback/"]};
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

/*
app.listen(PORT, ()=>{
	console.log("listening asdfsdf " + PORT)
})
*/

//dowebsocketstuff();

bobabytewebsocket();

httpServer.listen(PORT, ()=>{
	console.log("listening asdfsdf " + PORT)
});