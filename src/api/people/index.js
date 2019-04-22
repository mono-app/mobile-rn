import { UserCollection } from "../database/collection";
import { Document } from "../database/document";
import { GetDocument } from "../database/query";
import SInfo from "react-native-sensitive-info";

export default class PeopleAPI{
  /**
   * 
   * @param {String} email 
   * @param {String} source - default value `default`, available value `cache`, `server`, `default`
   * @returns {Promise} - object of user in firebase, or null if cannot find
   */
  getDetail(email, source="default"){
    const userCollection = new UserCollection();
    const userDocument = new Document(email);
    const getDocumentQuery = new GetDocument();
    getDocumentQuery.setGetConfiguration(source);
    return getDocumentQuery.executeQuery(userCollection, userDocument).then(doc => {
      if(doc.exists) return doc.data();
      else return null;
    })
  }

  /**
   * @returns {Promise} - a promise that contains a `currentUserEmail` variable. return your currentUserEmail
   */
  getCurrentUserEmail(){
    return SInfo.getItem("currentUserEmail", {})
  }
}