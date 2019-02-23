/** @format */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.addMessage = functions.https.onRequest((req, res) => {
  try {
    //const path = req.originalUrl;
    let docRef = db.collection('counters').doc('website');
    var setAda = docRef.set({
      count: 1,
    });
  } catch (err) {
    res.send(JSON.stringify(err));
    throw err;
  }
  res.send('ook');
});

exports.addMessageTwo = functions.https.onRequest((req, res) => {
  try {
    var aTuringRef = db.collection('users').doc('aturing');

    var setAlan = aTuringRef.set({
      first: 'Alan',
      middle: 'Mathison',
      last: 'Turing',
      born: 1912,
    });
  } catch (err) {
    res.send(JSON.stringify(err));
    throw err;
  }
  res.send('0ook');
});

exports['counter'] = functions.https.onRequest((req, res) => {
  db.collection('counters')
    .get()
    .then((snapshot) => {
      let ref = req.header('Referer');
      ref = ref || 'root';
      let aTuringRef = db.collection('counters').doc(ref);
      let found;
      let count;
      snapshot.forEach((doc) => {
        let data = doc.data();
        if (doc.id === ref) {
          console.info(`db object ${ref} found`);
          found = data;
        }
      });
      if (found == null) {
        console.info('setting count to 1');
        count = 1;
      } else {
        console.info(`setting count to ${found.count + 1}`);
        count = found.count + 1;
      }
      let setAlan = aTuringRef.set({
        count,
      });
      res.send('' + count);
      return snapshot;
    })
    .catch((err) => {
      console.error('Error getting documents', err);
      res.status(500).send('Unhandled top level server error: ' + JSON.stringify(err.message));
    });
});
