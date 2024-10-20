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
  const response = await fetch(self.location.origin+"/hh-save-sub", {
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

const newAnnos = async ()=>{
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({msg: 'Hello from SW'}));
  })
}

self.addEventListener('activate', async (event) => {
  // This will be called only once when the service worker is activated.
  const applicationServerKey = urlB64ToUint8Array(
    'BMB_y56I13CAajXJJWVdLFJebSmyYkBXQxYZoNyPy8gyj5rEfkOZPCHki88NGlZsmKMij7CzGzOhTkw2jYtxrHk'
  )
  const options = { applicationServerKey, userVisibleOnly: true }
  var subscription,params,response;
  try {
    subscription = await self.registration.pushManager.subscribe(options)
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

self.addEventListener("push", function(event) {
  if (event.data) {
    var b = (event.data.json())
    showLocalNotification(b.title, b.body, self.registration);
    newAnnos();
  } else {
    console.log("Push event but no data");
  }
});
/*
self.addEventListener("pushsubscriptionchange", async function(event){
  try {
    const applicationServerKey = urlB64ToUint8Array(
      'BMB_y56I13CAajXJJWVdLFJebSmyYkBXQxYZoNyPy8gyj5rEfkOZPCHki88NGlZsmKMij7CzGzOhTkw2jYtxrHk'
    )
    const options = { applicationServerKey, userVisibleOnly: true }
    const subscription = await self.registration.pushManager.subscribe(options)
    console.log(self.location,self.location.search)
    var params = new URLSearchParams(self.location.search);
    const response = await saveSubscription(params.get("user"),subscription)
    console.log(response)
  } catch (err) {
    console.log('Error', err)
  }
})*/
const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body:body,
    image:self.origin+"/hippohack/logo.png",
    title:""
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};