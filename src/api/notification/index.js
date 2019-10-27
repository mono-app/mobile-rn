import firebase from "react-native-firebase";
import MessagingToken from "src/entities/messagingToken";
import Database from "src/api/database";
import { UserCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

class NotificationAPI{

  /**
   * 
   * @param {string} id 
   * @param {string} name 
   * @param {int} priority 
   */
  static createChannel(id, name, priority=firebase.notifications.Android.Importance.Max){
    const channel = firebase.notifications.Android.Channel(id, name, priority);
    firebase.notifications().android.createChannel(channel);

  }

  static async initialize(){
    try{
      const isNotificationEnabled = await firebase.messaging().hasPermission();
      if(!isNotificationEnabled) await firebase.messaging().requestPermission();

      // Creating notification channel for Android
      Notification.createChannel("message-notification", "Message Notification");
      Notification.createChannel("disucssion-notification", "Discussion Notification");
      Notification.createChannel("friendrequest-notification", "Friend Request Notification");
      Notification.createChannel("moment-notification", "Moment Notification");
    }catch(err){}
  }

  static async generateToken(){
    const token = await firebase.messaging().getToken();
    if(!token) throw new CustomError("notification/not-signed-in", "User is not signed, please sign in first to get the token");
    return Promise.resolve(token);
  }

  /**
   * 
   * @param {MessagingToken} token 
   */
  static async storeToken(token){
    await Database.insert(async (database) => {
      const usersCollection = new UserCollection();
      const userDocument = new Document(token.owner.id);
      const userRef = database.collection(usersCollection.getName()).doc(userDocument.getId());
      await userRef.update({ "tokenInformation.messagingToken": token.token });
    })
  }
}

export default NotificationAPI;