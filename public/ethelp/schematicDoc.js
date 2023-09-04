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
var o = [
	"tutor1",
	"tutor2",
	"tutor3"
]

//student request
var stuReq = {
	first:"",
	user:"",
	msg:"", //this is the init message
	date:1234567890, //date requested
	subjects:["subjects that student needs help in"]
}

/*

Tutor online flowchart:

Tutor signs in > username stored on localstorage > post to server username that is online
> update online arr in mongodb >  tell all service workers to update their clients' online tutors

sw receives msg to update onlinetutors WITH THE CURR ONLINE TUTORS > sw post online tutors to client
> [^] client goes thru online tutors and one-by-one gets their data and loads in the body
[^] Note: does it one-by-one cuz if done same time the images (ie pfps) over post req would be too large

Tutor is online, pings post msg to /et-online
window.onbeforeunload post msg to /et-offline



*/