const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

exports.addCard = functions.https.onRequest(async (req, res) => {
  let msg = req.body.data ? req.body.data : null;
  msg = req.body.data.msg ? req.body.data.msg : null;

  let author = req.body.data ? req.body.data : null;
  author = req.body.data.author ? req.body.data.author : null;

  if(!author || !msg){
    res.status(400).send("Bad request format!");
    return;
  }

  if(author.length === 0 || msg.length === 0){
    res.status(400).send("Error. Cannot be Empty");
    return;
  }

  //gets current counter
  var counterRef = await db.collection("meta").doc("main").get();
  var counter = counterRef.data().counter;

  //inserts new card to db
  var cardRef = db.collection("cards");
  await cardRef.add({author, msg, id: counter});

  //update the counter in metadata
  db.collection("meta").doc("main").update({
    counter: counter+1,
    lastUpdated: Date.now()
  });

  res.send("OK");
});

exports.getCard = functions.https.onRequest(async (req, res) => {
  let id = req.body.data ? req.body.data : null;
  id = req.body.data.id ? req.body.data.id : null;
  if(!id){
    res.status(400).send("Bad request format!");
    return;
  }

  var query = await db.collection("cards").where("id", "==", id).get();
  if(query.empty){
    res.status(400).send("Invalid ID");
    return;
  }

  let queryArr = [];
  query.forEach((item) => {
    queryArr.push(item.data());
  });

  res.send(queryArr[0]);
});

exports.getAllCards = functions.https.onRequest(async (req, res) => {
  var cardsRef = db.collection("cards");
  const snapshot = await cardsRef.get();
  let arr = [];
  snapshot.docs.forEach( (item) => (arr.push(item.data())) );
  arr.sort((a,b) => a.id > b.id);
  console.log(arr);
  res.send(arr);
});

exports.deleteCard = functions.https.onRequest(async (req, res) => {
  let id = req.body.data ? req.body.data : null;
  id = req.body.data.id ? req.body.data.id : null;

  console.log(req.body);
  if(id === null){
    res.status(400).send("Bad request format!");
    return;
  }
  let query = await db.collection("cards").where("id", ">=", id).get();

  if(query.empty){
    res.status(400).send("Invalid Delete ID");
    return;
  }

  query.forEach((item) => {
    let tempId = item.data().id;
    if(tempId === id){
      item.ref.delete();
    }
    else{
      item.ref.update({id: tempId-1});
    }
  });

  var counterRef = await db.collection("meta").doc("main").get();
  var counter = counterRef.data().counter;
  db.collection("meta").doc("main").update({
    counter: counter-1,
    lastUpdated: Date.now()
  });

  res.send("Deleted");
});


exports.registerUser = functions.https.onRequest(async (req, res) => {
  let deviceId = req.body.data ? req.body.data : null;
  deviceId = req.body.data.deviceId ? req.body.data.deviceId : null;

  let username = req.body.data ? req.body.data : null;
  username = req.body.data.username ? req.body.data.username : null;

  if(!deviceId || !username){
    res.status(400).send("Bad request format!");
    return;
  }

  if(deviceId.length === 0 || username.length === 0){
    res.status(400).send("Cannot be empty");
    return;
  }

  let usernameCheck = await db.collection("users").where("username", "==", username).get();

  if(usernameCheck.empty){
    let deviceIdCheck = await db.collection("users").where("deviceId", "==", deviceId).get();
    if(deviceIdCheck.empty){
      db.collection("users").add({deviceId, username});
      res.status(442).send("User Created!");
    }
    else{
      deviceIdCheck.forEach((item) => {item.ref.update({username: username})});
      res.status(441).send("Username updated.");
    }
  }
  else{
    res.status(440).send("Username Exists, please enter new username");
  }

});

exports.getUsername = functions.https.onRequest(async (req, res) => {
  let deviceId = req.body.data ? req.body.data : null;
  deviceId = req.body.data.deviceId ? req.body.data.deviceId : null;

  if(!deviceId){
    res.status(400).send("Bad request format!");
    return;
  }
  let usernameCheck = await db.collection("users").where("deviceId", "==", deviceId).get();
  if(usernameCheck.empty){
    res.status(443).send("Not registered");
  }
  else{
    let arr = [];
    usernameCheck.forEach( (item) => arr.push(item.data()) );
    res.status(445).send(arr[0]);
  }

});
