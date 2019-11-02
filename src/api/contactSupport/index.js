import firebase from "react-native-firebase";
import Database from "../database";
import { ContactSupportCollection } from "src/api/database/collection"

export default class ContactSupportAPI{

  /**
   * 
   * @param {*ContactSupportMessage} contactSupportMessage 
   */
  static async sendContactSupportMessage(contactSupportMessage){
    await Database.insert(async db=>{
      const contactSupportCollection = new ContactSupportCollection()
      const contactSupportRef = db.collection(contactSupportCollection.getName()).doc()
      await  contactSupportRef.set({creationTime: firebase.firestore.FieldValue.serverTimestamp(), ...contactSupportMessage.data })
    })

    return Promise.resolve(true)
  }
}