import firebase from "react-native-firebase";
import OfflineDatabase from "src/api/database/offline";

export default class Database{
  static chooseDatabase(online){
    if(online) return firebase.firestore();
    else return OfflineDatabase.database;
  }

  static async listen(func, online=true){ return await func(Database.chooseDatabase(online)) }
  static async insert(func, online=true){ return await func(Database.chooseDatabase(online)) }
  static async update(func, online=true){ return await func(Database.chooseDatabase(online)) }
  static async delete(func, online=true){ return await func(Database.chooseDatabase(online)) }
  static async get(func, online=false){ return await func(Database.chooseDatabase(online)) }
}