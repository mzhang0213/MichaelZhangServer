//idea: et help is in get help

//mongodb

//item in db:tutors
//all items stored in tutors:[]
var t = {
	user:"username",
	first:"firstname",
	last:"lastname",
	grade:"int",
	school:"ABRHS <do abbreviation>",
	subjects:[
		{
			subject:"Geometry",
			topic:"Math"
		}
	//all pos subjects under "Math": Alg I, Geo, Alg II, Precalc, Calc, AP Calc AB, AP Calc BC
	//all pos subjects under "Science": Bio, Chem, Env Sci, Physics, + AP ...
	//all pos subjects under "English": Eng
	//all pos subjects under "History": US I, US II, World, Euro
	//all pos subjects under "Social Studies": Macro, Micro, Psych
	//all pos subjects under "Language": Eng, Fr, Sp, Mandarin, Latin

	]
}

//db:online
var o = [
	"tutor1",
	"tutor2",
	"tutor3"
]