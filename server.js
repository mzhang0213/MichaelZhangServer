const express = require("express");
const app = express();
const PORT = process.env.PORT | 12232;

app.listen(PORT, (req,res)=>{
	res.writeHead(200, "Hi");
})