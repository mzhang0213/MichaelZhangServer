setInterval(function(){
	var params = new URLSearchParams(self.location.search);
	if (params.get("from")==="tutor"){
		postMessage({"go":"do it"});
	}
},2.5*1000)