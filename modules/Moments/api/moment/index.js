import firebase from "react-native-firebase";

import { MomentsCollection } from "src/api/database/collection";
import { AddDocument } from "src/api/database/query";

export default class MomentAPI{
  /**
   * 
   * @param {String} posterEmail - 
   * @param {Object} content 
   */
  static publishMoment(posterEmail, content){
    const payload = {
      posterEmail, content,
      postTime: firebase.firestore.FieldValue.serverTimestamp(),
      privacy: "friends"
    }

    const collection = new MomentsCollection();
    const query = new AddDocument();
    return query.executeQuery(collection, null, payload).then(() => {
      return true
    }).catch(err => {
      console.log(err);
      return false;
    });
  }
}