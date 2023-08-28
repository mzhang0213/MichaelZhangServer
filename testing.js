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
/*
async function run(){
	try {
		//once the groups have populated, divide them up into groups a and b in contest
		await client.connect();
		const db_accs = client.db("hippohack2023").collection("accounts");
		const currContent_groups = await db_accs.findOne();
		var groups = currContent_groups.groups;
		const db_contest = client.db("hippohack2023").collection("contest");

		var submitA = []
		var submitB = []
		for (var i=0;i<groups.length/2;i++){
			submitA.push(groups[i]);
		}
		for (var i=groups.length/2;i<groups.length;i++){
			submitB.push(groups[i]);
		}

		const filter = {title:"contest"}
		const updateDoc = {
			$set: {
				groups:{
					a:submitA,
					b:submitB
				}
			}
		}
		await db_contest.updateOne(filter,updateDoc);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir)
*/
async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		const db_accs = client.db("hippohack2023").collection("accounts");
		const currContent_accs = await db_accs.findOne();
		var accs_content = currContent_accs.usernames;
		console.log(accs_content)
		var rawNames=["Maria	Huang Ryan	Chang"]
		rawNames=rawNames[0].split(" ")
		var names=[]
		var submit = []
		for (var i=0;i<accs_content.length;i++){
			submit.push(accs_content[i]);
		}
		for (var i=0;i<rawNames.length;i++){
			names.push(rawNames[i].split("\t"));
			var name = (names[i][0].charAt(0)+names[i][1].charAt(0)).toLowerCase()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString();
			var user = {
				user:name,first:names[i][0],last:names[i][1]
			}
			submit.push(user);
		}
		const filter = {title:"usernames"}
		const updateDoc = {
			$set: {
				usernames:submit
			}
		}
		await db_accs.updateOne(filter,updateDoc).then(async function(){
			await client.close();
		});
	} catch(error) {
		// Ensures that the client will close when you finish/error
		console.log(e);
	}
}
run().catch(console.dir);