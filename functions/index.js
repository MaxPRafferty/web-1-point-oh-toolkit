/** @format */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

exports['counter'] = functions.https.onRequest((req, res) => {
  db.collection('counters')
    .get()
    .then((snapshot) => {
      let ref = req.query.counter;
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
