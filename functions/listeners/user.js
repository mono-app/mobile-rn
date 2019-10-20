const functions = require("firebase-functions");
const admin = require("firebase-admin");

function UserListener(){}

UserListener.triggerUserChange = functions.region("asia-east2").firestore.document("/users/{userId}").onUpdate(async (documentSnapshot, context) => {
  const { userId } = context.params;
  const changes = documentSnapshot.after.data();

  if(changes.isCompleteSetup){
    const db = admin.firestore();
    const friendListRef = db.collection("friendList").doc(userId).collection("people");
    const changesRef = db.collection("changes");
    const querySnapshot = await friendListRef.get();
    const friends = querySnapshot.docs.map((documentSnapshot) => documentSnapshot.id);

    const promises = friends.map((friend) => {
      const changePayload = {
        recipient: friend, createdTime: admin.firestore.FieldValue.serverTimestamp(),
        primary: { key: "id", value: userId }, collection: "users", task: "modify", value: changes
      }

      const newChange = changesRef.doc();
      return newChange.set(changePayload);
    });
    await Promise.all(promises);
  }
  return Promise.resolve();
})

module.exports = UserListener;