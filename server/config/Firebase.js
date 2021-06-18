const firebase_admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

var serviceAccount = require(process.env.KEY_PATH);

const admin = firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

module.exports = { admin, auth };
