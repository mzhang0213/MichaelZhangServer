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
  
  self.addEventListener("waiting", async (event)=>{
	self.skipWaiting();
  })

  self.addEventListener('activate', async (event) => {
	/*
	// This will be called only once when the service worker is activated.
	const applicationServerKey = urlB64ToUint8Array(
	  'BAgfYISTfBzr9lElR16BE2zQNkK5HImAZZuXyEwfkLkI1OipeQhKTjOeS8ExTr2eU2cLe9FLaNQssjcLbB29JtA'
	)
	const options = { applicationServerKey, userVisibleOnly: true }
	var subscription,params,response;
	var tainted = false;

	try{
		self.clients.claim();
		console.log("claimed hopefully");
	  } catch (err) {
		console.log('(3) client claim error', err)
	  }
	try {
	  subscription = await self.registration.pushManager.subscribe(options);
	} catch (err) {
	  console.log('(1) sub Error', err)
	  tainted=true;
	}
	if (!tainted){
		console.log("subbed")
		params = new URLSearchParams(self.location.search);
		try{
		  response = await saveSubscription(params.get("user"),subscription)
		} catch (err) {
		  console.log('(2) save sub Error', err)
		}
	}else console.log("tainted rip");
	console.log(response)
	console.log(subscription)*/
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

  self.addEventListener("message",async function(event){
	if (event.data.type==="claim"){
		event.waitUntil(self.clients.claim());
		console.log("claimed bitc");
	}else if (event.data.type==="sub"){
		// This will be called only once when the service worker is activated.
		const applicationServerKey = urlB64ToUint8Array(
			'BAgfYISTfBzr9lElR16BE2zQNkK5HImAZZuXyEwfkLkI1OipeQhKTjOeS8ExTr2eU2cLe9FLaNQssjcLbB29JtA'
		)
		const options = { applicationServerKey, userVisibleOnly: true }
		var subscription,params,response;
		var tainted = false;
	
		try {
			subscription = await self.registration.pushManager.subscribe(options);
		} catch (err) {
			console.log('(1) sub Error', err)
			tainted=true;
		}
		if (!tainted){
			console.log("subbed")
			params = new URLSearchParams(self.location.search);
			try{
				response = await saveSubscription(params.get("user"),subscription)
			} catch (err) {
				console.log('(2) save sub Error', err)
			}
		}else console.log("tainted rip");
		console.log(response)
		console.log(subscription)
	}
  })
  
  self.addEventListener("push", function(event) {
	if (event.data) {
	  var b = (event.data.json())
	  //showLocalNotification(b.title, b.body, self.registration);
	  self.clients.matchAll().then((clients) => {
		  console.log("clients "+clients.length);
		  clients.forEach((client) => {
			  console.log("client url: " + client.url);
			  if (b.action==="online" && client.url===self.location.origin+"/ethelp/"){
				client.postMessage({updatedUser:b.updatedUser})

			}else if (b.action==="confirm" && client.url===self.location.origin+"/ethelp/"){
				client.postMessage({confirm:b.confirm}) //not finished

			}else if (b.action==="text" && client.url.indexOf("ethelp/chat")!==0){
				client.postMessage({text:b.text});
			
			}else if (b.action==="endSession" && client.url.indexOf("ethelp/chat")!==0){
				client.postMessage({endSession:b.endSession});
				
			}else{
				console.log("webpush action not coded in the sw which is fine");

			}
			console.log(b);
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