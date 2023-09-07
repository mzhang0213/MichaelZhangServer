//idea: et help is in get help

//mongodb

//item in db:tutors
//CHANGE TO SCHEM: each document will contain ONE tutor
var db = {
	tutorOverview:{
		id:"whatever",
		title:"tutorOverview",
		tutors:["usernames"]
	},
	tutor1:{
		user:"username",
		first:"firstname",
		last:"lastname",
		grade:"int",
		school:"ABRHS <do abbreviation>",
		image:"data/img",
		subjects:[
			{
				subject:"Geometry",
				topic:"Math"
			}
		]
		//tutors have a username, first, last, grade, school, image link, subjects
		//all pos subjects under "Math": Alg I, Geo, Alg II, Precalc, Calc, AP Calc AB, AP Calc BC
		//all pos subjects under "Science": Bio, Chem, Env Sci, Physics, + AP ...
		//all pos subjects under "English": Eng
		//all pos subjects under "History": US I, US II, World, Euro
		//all pos subjects under "Social Studies": Macro, Micro, Psych
		//all pos subjects under "Language": Eng, Fr, Sp, Mandarin, Latin
	},
	tutor2:{},
	tutor3:{yet:"another document"}
}
//db:online
var o = {
	title:"online",
	online:[
		{
			user:"MichaelZ_123",
			date:0 //last Date.now() they were online. on page ethelp, if Date.now-date>15secs, they are offline
		}
	]
}

//student request
var stuReq = {
	first:"",
	user:"",
	msg:"", //this is the init message
	date:1234567890, //date requested
	subjects:["subjects that student needs help in"]
}

/*

when new tutor is created, create a copy of them in online

Tutor online flowchart:

Tutor signs in > username stored on localstorage > post to server username that is online
> directly tell all service workers to update their clients' online tutors

sw receives msg to update onlinetutors WITH ONE CURR ONLINE TUTOR > sw post THE TUTOR to client
> [^] client goes takes this tutor, goes to /et-getTutor, marks online

[^] Note: does it one-by-one cuz if done same time the images (ie pfps) over post req would be too large

*/

/*

choosing subjects i need help with:
-tutor's subjects are loaded
show all subjects off to the side
	NOTE: Make the load subjects function as its own function
on check, show all subjects with all cols
	Note: make the non-primary subjects faded (opacity or prob just choose lighter colors)

on click subject, border highlight gold, maybe try to do a double layer border? idk

*/

/*

tutor get help pathway:
1. client finds tutor online and hits connect
2. msg gets sent dir to tutor, they get msg and it pops up
3. tutor has 60s to hit connect with student button. while msg is being sent out and await, on client side mark outgoing requests
	a. tutor hits yes, then post to /et-confirm directly to user's sw and take them to either i) external messaging site or ii) delete all elements on the body and start messaging lol idk
	b. tutor does not hit anything for 60s. then post to /et-confirm that request expired, take the outgoing request on the client side off of the page and maybe tell them that request was denied sadge

*/