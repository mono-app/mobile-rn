import firebase from "react-native-firebase";
import Logger from "src/api/logger";

function OfflineSyncAPI(){}

OfflineSyncAPI.authListener = null;
OfflineSyncAPI.changesListener = null;

OfflineSyncAPI.handleChanges = (querySnapshot) => {
  Logger.log("OfflineSyncAPI.handleChanges#querySnapshot", querySnapshot);
  querySnapshot.docChanges.forEach((change) => {
    if(change.type === "added"){
      const documentSnapshot = change.doc;
      const data = documentSnapshot.data();
      Logger.log("OfflineSyncAPI.handleChanges#data", data);
    }
  });
}

OfflineSyncAPI.listen = () => {
  if(OfflineSyncAPI.authListener) OfflineSyncAPI.authListener();
  OfflineSyncAPI.authListener = firebase.auth().onAuthStateChanged((user) => {
    if(user){
      if(OfflineSyncAPI.changesListener) OfflineSyncAPI.changesListener();

      Logger.log("OfflineSyncAPI.listen#user.email", user.email);
      const db = firebase.firestore();
      const changesRef = db.collection("changes").where("recipient", "==", user.email).where("isApplied", "==", false);
      OfflineSyncAPI.changesListener = changesRef.onSnapshot(OfflineSyncAPI.handleChanges)
    }else {
      if(OfflineSyncAPI.changesListener) OfflineSyncAPI.changesListener();
    }
  })
}

OfflineSyncAPI.removeListener = () => {
  Logger.log("OfflineSyncAPI.removeListener", "removing listener");
  if(OfflineSyncAPI.authListener) OfflineSyncAPI.authListener();
  if(OfflineSyncAPI.changesListener) OfflineSyncAPI.changesListener();
}


export default OfflineSyncAPI;