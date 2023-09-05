var express = require("express");
var app = express();
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
const PORT = process.env.PORT || "12232";
var app = express();
app.use(express.static(__dirname + '/public')).use(cors()).use(cookieParser()).use(bodyParser.json({limit:"50mb"}));


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mzhang0213:jIdggOURnfAJOROQ@heroku.qkcqp9r.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


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
			msg.error=0;
			await db.insertOne(doc);
		})().then(async function(){
			await client.close()
			res.send(JSON.stringify(msg));
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
				await client.close();
			})
		})()
	} catch(error) {
		// Ensures that the client will close when you finish/error
		console.log(error);
	}
})


app.get("/et-getTutors",async (req,res)=>{
	var msg = {
		online:[]
	};
	try{
		(async function(){
			await client.connect();
			const db = client.db("ethelp").collection("online");
			var currContent = await db.findOne();
			var online = currContent.online;
			msg.online=online;
			res.send(JSON.stringify(msg));
		})().then(async function(){
			await client.close();
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
					break;
				}
			}
			res.send(JSON.stringify(msg));
		})().then(async function(){
			await client.close();
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
			const db = client.db("ethelp").collection("online");
			var currContent = await db.findOne();
			var online = currContent.online;
			online.push(req.body.user);
			const filter = {title:"online"}
			const updateDoc = {
				$set: {
					online:online
				}
			}
			await db.updateOne(filter,updateDoc);

			const db_subs = client.db("ethelp").collection("subs");
			const currContent_subs = await db_subs.findOne();
			var subs_content = currContent_subs.subsUsers;
			var message = {
				online:online
			};
			for (var i=0;i<subs_content.length;i++){
				//for each subscription, send noti
				sendNotification(subs_content[i].sub,message);
			}
			res.send(JSON.stringify({error:0}))
		})().then(async function(){
			await client.close();
		})
	} catch(error) {
		// Ensures that the client will close when you finish/error
		console.log(error);
	}
})

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
				console.log(online[i]);
				if (online[i]!==req.body.user){
					console.log(online[i]);
					console.log(req.body.user);
					console.log(online[i]===req.body.user);
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
			await client.close();
		})
	} catch(error) {
		// Ensures that the client will close when you finish/error
		console.log(error);
	}
})

app.post("/et-save-sub",async(req,res)=>{
	try{
		//data: req.body.user req.body.sub
		await client.connect();
		const db = client.db("ethelp").collection("subs");
		const currContent = await db.findOne();
		var db_subs = currContent.subsUsers;
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
				subsUsers:submit
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

app.post("/et-unregister",async(req,res)=>{
	try{
		//data: req.body.user req.body.type
		await client.connect();
		const db = client.db("ethelp").collection("subs");
		const currContent = await db.findOne();
		var db_subs = [];
		if (req.body.type==="user"){
			db_subs=currContent.subsUsers;
		}else if (req.body.type==="tutor"){
			db_subs=currContent.subsTutors;
		}
		var submit = [];
		for (var i=0;i<db_subs.length;i++){
			//found a sub that alr has a user
			//dont push the old sub back, update the it instead
			if (db_subs[i].user!==req.body.user){
				submit.push(db_subs[i]);
			}
		}
		const filter = {title:"subs"}
		const updateDoc = {
			$set: {
				subsUsers:submit
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

app.post("/et-anno", async(req,res)=>{
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
/*
//does not work
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
*/
app.listen(PORT, ()=>{
	console.log("listening asdfsdf " + PORT)
})
