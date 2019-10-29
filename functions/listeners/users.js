const admin = require("firebase-admin");
const functions = require("firebase-functions");

function UserListener(){}

UserListener.triggerChangeNickname = functions.region("asia-east2").firestore.document("/users/{userId}").onUpdate((change, context) => {
  // give random value to friendList
  const { userId } = context.params;
  const dataBefore = change.before.data()
  const dataAfter = change.after.data()

  if(dataBefore.applicationInformation && dataAfter.applicationInformation && (dataBefore.applicationInformation.nickName !== dataAfter.applicationInformation.nickName)){
    const db = admin.firestore();
    const friendListRef = db.collection("friendList").doc(userId)
    friendListRef.update({userLastUpdate: admin.firestore.FieldValue.serverTimestamp()})
  }
});


UserListener.triggerNewStatus = functions.region("asia-east2").firestore.document("/users/{userId}/status/{statusId}").onCreate((documentSnapshot, context) => {
  // give random value to friendList
  const { userId } = context.params;
  const db = admin.firestore();
  const friendListRef = db.collection("friendList").doc(userId)
  friendListRef.update({userLastUpdate: admin.firestore.FieldValue.serverTimestamp()})
});
module.exports = UserListener;