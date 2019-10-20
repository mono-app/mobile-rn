import firebase from "react-native-firebase";
import Logger from "src/api/logger";
import OfflineDatabase from "src/api/database/offline";
import { getConnection } from "typeorm";
import { Document } from "src/api/database/models";

function OfflineSyncAPI(){}

OfflineSyncAPI.authListener = null;
OfflineSyncAPI.changesListener = null;
OfflineSyncAPI.deleteChanges = async (id) => {
  Logger.log("OfflineSyncAPI.deleteChanges#id", id);
  const db = firebase.firestore();
  const changeRef = db.collection("changes").doc(id);
  await changeRef.delete();
}

OfflineSyncAPI.applyChanges = async (rawData) => {
  const { id, data } = rawData;
  Logger.log("OfflineSyncAPI.applyChanges#data.value", data.value);
  const model = new Document();
  model.id = data.primary.value;
  model.collection = data.collection;
  model.jsonValue = JSON.stringify(data.value);
  Logger.log("OfflineSyncAPI.applyChanges#model", model);

  try{
    const connection = await getConnection();
    const repository = connection.getRepository("Document");
    await repository.save(model);
    OfflineDatabase.triggerEvent("change", data.collection);
    await OfflineSyncAPI.deleteChanges(id);
  }catch(err){
    Logger.log("OfflineSyncAPI.applyChanges#err.name", err.name);
  }
}

OfflineSyncAPI.handleChanges = (querySnapshot) => {
  Logger.log("OfflineSyncAPI.handleChanges#querySnapshot", querySnapshot);
  querySnapshot.docChanges.forEach((change) => {
    if(change.type === "added"){
      const documentSnapshot = change.doc;
      const data = { id: documentSnapshot.id, data: documentSnapshot.data() };
      Logger.log("OfflineSyncAPI.handleChanges#data", data);
      OfflineSyncAPI.applyChanges(data);
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
      const changesRef = db.collection("changes").where("recipient", "==", user.email);
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