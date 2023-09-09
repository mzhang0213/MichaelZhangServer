setInterval(function(){
	self.clients.matchAll().then(clients => {
		clients.forEach(client =>function(){
			if (client.url==="/ethelp/"){
				client.postMessage({"go":"do it"});
			}
		})
	})
},5.5*1000)
setInterval(function(){
	self.clients.matchAll().then(clients => {
		clients.forEach(client =>function(){
			if (client.url==="/ettutor/"){
				client.postMessage({"go":"do it"});
			}
		})
	})
},2.5*1000)