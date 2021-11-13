const express = require("express");
const app = express();
const PORT = process.env.PORT || "12232";

app.use(express.static('public'));

app.listen(PORT, ()=>{
	console.log("listening asdfsdf " + PORT)
})