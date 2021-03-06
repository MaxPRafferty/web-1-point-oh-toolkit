/** @format */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
var gm = require('gm').subClass({ imageMagick: true });
require('gm-base64');

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

exports['counter'] = functions.https.onRequest((req, res) => {
  db.collection('counters')
    .get()
    .then((snapshot) => {
      /* evidently referer isnt making it to google cloud. problem for another day.*/
      //let ref = req.header('referer');
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
      let width = 12 + 14 * ('' + count).split('').length;
      gm(width, 27, '#000000dd')
        .fill('#000000dd')
        .drawRectangle(0, 0, 510, 510)
        .font('font.ttf', 20)
        .fill('#ffffff')
        .drawText(10, 20, '' + count)
        .toBase64('png', function(err, base64) {
          if (err != null) {
            throw err;
          }
          console.info(`got base64 encoding: ${base64}`);
          var img = new Buffer(base64, 'base64');

          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length,
            'Access-Control-Allow-Origin': 'https://maxrafferty.com/',
          });
          res.end(img);
        });
      //res.send('data:text/plain;charset=utf-8;base64,MQ==');
      //res.send('' + count);
      return snapshot;
    })
    .catch((err) => {
      console.error('Error getting documents', err);
      res.status(500).send('Unhandled top level server error: ' + JSON.stringify(err.message));
    });
});
