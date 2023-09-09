// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
	const rawData = atob(base64)
	const outputArray = new Uint8Array(rawData.length)
	for (let i = 0; i < rawData.length; ++i) {
	  outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
  }
  
  // saveSubscription saves the subscription to the backend
  const saveSubscription = async (username, subscription) => {
	console.log("pushing to db");
	const response = await fetch(self.location.origin+"/et-save-sub", {
	  method: 'post',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
		user:username,
		sub:subscription
	  })
	})
	console.log(response);
	console.log("posted")
	return response
  }
  
  self.addEventListener("install", async (event)=>{
	self.skipWaiting();
  })

  self.addEventListener('activate', async (event) => {
	// This will be called only once when the service worker is activated.
	const applicationServerKey = urlB64ToUint8Array(
	  'BAgfYISTfBzr9lElR16BE2zQNkK5HImAZZuXyEwfkLkI1OipeQhKTjOeS8ExTr2eU2cLe9FLaNQssjcLbB29JtA'
	)
	const options = { applicationServerKey, userVisibleOnly: true }
	var subscription,params,response;
	try {
	  subscription = await self.registration.pushManager.subscribe(options);
	} catch (err) {
	  console.log('(1) sub Error', err)
	}
	console.log("subbed")
	console.log(self.location,self.location.search)
	params = new URLSearchParams(self.location.search);
	try{
	  response = await saveSubscription(params.get("user"),subscription)
	} catch (err) {
	  console.log('(2) save sub Error', err)
	}
	console.log(response)
  })

  const alertError = async ()=>{
	const response = await fetch(self.location.origin+"/et-WEBPUSH-ERROR-WEBPUSH-ERROR-AHHHHH", {
		method: 'get',
		headers: {
		  'Content-Type': 'application/json',
		},
	  })
	  console.log(response);
	  console.log("posted");
  }
  
  self.addEventListener("push", function(event) {
	if (event.data) {
	  var b = (event.data.json())
	  console.log("got push message, data:");
	  console.log(b);
	  //showLocalNotification(b.title, b.body, self.registration);
	  self.clients.matchAll().then(clients => {
		clients.forEach(client =>function(){
			if (b.action==="online" && client.url==="/ethelp/"){
				client.postMessage({updatedUser:b.updatedUser})
			
			}else if (b.action==="connect" && client.url==="/ettutor/"){
				client.postMessage({newMessage:b.newMessage});
				
			}else if (b.action==="confirm" && client.url==="/ethelp/"){
				client.postMessage({}) //not finished
			}else{
				console.log("webpush action not coded in the sw or some BUG WTF");
				alertError();
			}
		})
	  })
	} else {
	  console.log("Push event but no data");
	}
  });
  const showLocalNotification = (title, body, swRegistration) => {
	const options = {
	  body:body,
	  image:self.origin+"/hippohack/logo.png",
	  title:""
	  // here you can add more properties like icon, image, vibrate, etc.
	};
	swRegistration.showNotification(title, options);
  };