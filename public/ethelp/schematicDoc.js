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