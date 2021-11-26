const express = require("express");
const app = express();
const PORT = process.env.PORT || "12232";

app.use(express.static('public'));

app.get("/uploads/*", (req, res)=>{
    res.sendFile(__dirname+req.url.substring(req.url.indexOf("/uploads/")));
});

app.listen(PORT, ()=>{
	console.log("listening asdfsdf " + PORT)
})