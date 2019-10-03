import firebase from "react-native-firebase";
import { UserMappingCollection } from "src/api/database/collection";
import uuid from "uuid/v4"
import {AsyncStorage} from 'react-native';

export default class UserMappingAPI{
  static async setAccessToken (email){
    const db = firebase.firestore();

    const userMappingCollection = new UserMappingCollection()
    const userMappingRef = db.collection(userMappingCollection.getName()).doc(email)
    const accessToken = uuid()
    const userMappingSnapshot = await userMappingRef.get()
    if(userMappingSnapshot.exists){
      await userMappingRef.update({accessToken})
    }else{
      await userMappingRef.set({accessToken})
    }
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
    } catch (error) {
      // Error saving data
    }
    return Promise.resolve(true)
  }

  static async getAccessToken(){
    const accessToken = await AsyncStorage.getItem('accessToken')
    return accessToken
  }

}