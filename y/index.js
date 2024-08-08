const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.checkTrainerExpiration = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async (context) => {
      try {
        console.log("Executing checkTrainerExpiration function...");

        const now = admin.firestore.Timestamp.now();
        const trainersRef = db.collection("Users");
        const snapshot = await trainersRef
            .where("role", "==", 8)
            .where("expirationDate", "<=", now)
            .get();

        if (!snapshot.empty) {
          const batch = db.batch();
          snapshot.docs.forEach((doc) => {
            batch.update(doc.ref, {membershipStatus: "suspended",
              expirationDate: "", PlanID: ""});
          });
          await batch.commit();
          console.log("Expired trainers have been suspended.");
        } else {
          console.log("No trainers to suspend.");
        }

        const SubscriberRef = db.collection("customers");
        const Subscribersnapshot = await SubscriberRef
            .where("role", "==", 2)
            .where("expirationDate", "<=", now)
            .get();

        if (!Subscribersnapshot.empty) {
          const batch2 = db.batch();
          Subscribersnapshot.docs.forEach((doc) => {
            batch2.update(doc.ref, {membershipStatus: "suspended"});
          });
          await batch2.commit();
          console.log("Expired Subscriber have been suspended.");
        } else {
          console.log("No Subscriber to suspend.");
        }
      } catch (error) {
        console.error("Error executing checkTrainerExpiration function:",
            error);
      }
    });

// Function to delete a user account online trainers and mangers gyms
exports.deleteUser = functions.https.onCall(async (data) => {
  const email = data.email;
  const id=data.id;

  try {
    // Get the user's UID by email
    const userRecord = await admin.auth().getUserByEmail(email);
    // Delete the user account
    if (userRecord) {
      await admin.auth().deleteUser(userRecord.uid);
    }

    // Optionally, remove the user document from Firestore
    await db.collection("Users").doc(id).delete();

    return {message: "User deleted successfully"};
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});

// Function for deleting costomers
exports.deleteCustomer = functions.https.onCall(async (data) => {
  const email = data.email;
  const id=data.id;

  try {
    // Get the user's UID by email
    const userRecord = await admin.auth().getUserByEmail(email);
    // Delete the user account
    if (userRecord) {
      await admin.auth().deleteUser(userRecord.uid);
    }

    // Optionally, remove the user document from Firestore
    await db.collection("customers").doc(id).delete();

    return {message: "User deleted successfully"};
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});
