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
async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		var rawNames=["Hanwen	Tang Joshua	Wu Thomas	Stubblefield Deven	Jadhav Omar	Boukantar Christopher	Zhang Aiden	Huang Bohan	Wang Jonathan	Xia Lok	Xia Max	Geng Anthony	Liu Kelly	Liu Eric	Xiang Serena	Hu Felix	Cui Richard	Taylor Andrew	Lu Alissa	Xiang Julia	Zhang Andrew	Zhang Emily	Wang Cailyn	Lu Amulya	Alladi Supreet	Sathish Charles	Bing Tori	Bell Ramya	Sankar Pritha	Anand Daniel	Song Gianna	Carrier Charles	Li Andrew	Liu"]
		rawNames=rawNames[0].split(" ")
		var names=[]
		var submit = []
		for (var i=0;i<rawNames.length;i++){
			names.push(rawNames[i].split("\t"));
			var name = (names[i][0].charAt(0)+names[i][1].charAt(0)).toLowerCase()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString();
			var user = {
				user:name,
				first:names[i][0],
				last:names[i][1]
			}
			submit.push(user);
		}
		await client.connect();
		const db = client.db("hippohack2023").collection("accounts");
		const filter = {title:"usernames"}
		const updateDoc = {
			$set: {
				usernames:submit
			}
		}
		await db.updateOne(filter,updateDoc);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);