import firebase from "react-native-firebase";

class BotsAPI{
  static normalize(documentSnapshot){
    const fullData = documentSnapshot.data();
    fullData.profilePicture = fullData.profilePicture.downloadUrl;
    return { id: documentSnapshot.id, ...fullData }
  }

  static async getDetail(botName){
    const db = firebase.firestore();
    const botSnapshot = await db.collection("bots").doc(botName).get();
    const bot = BotsAPI.normalize(botSnapshot);
    return Promise.resolve(bot);
  }
}
export default BotsAPI;