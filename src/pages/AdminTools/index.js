const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.checkTrainerExpiration = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  console.log('Executing checkTrainerExpiration function...');
  
  const now = admin.firestore.Timestamp.now();
  const trainersRef = db.collection('Users');
  const snapshot = await trainersRef.where('role', '==', 8).where('expirationDate', '<=', now).get();

  if (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { membershipStatus: 'suspended' });
    });
    await batch.commit();
    console.log('Expired trainers have been suspended.');
  } else {
    console.log('No trainers to suspend.');
  }
});
