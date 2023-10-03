setInterval(function(){
	var params = new URLSearchParams(self.location.search);
	if (params.get("from")==="user"){
		postMessage({"go":"do it"});
	}
},5.5*1000)