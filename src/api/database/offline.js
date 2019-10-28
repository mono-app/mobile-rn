import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import Logger from "src/api/logger";
import { appSchema, Database } from "@nozbe/watermelondb";
import { synchronize } from "@nozbe/watermelondb/sync";
import { DB_SYNCHRONIZER } from "react-native-dotenv";

import UsersSchema from "src/schemas/users";
import PersonalInformationsSchema from "src/schemas/personalInformations";
import ApplicationInformationsSchema from "src/schemas/applicationInformations";
import ProfilePicturesSchema from "src/schemas/profilePictures";
import PhoneNumbersSchema from "src/schemas/phoneNumbers";
import StatusesSchema from "src/schemas/statuses";
import FriendsSchema from "src/schemas/friends";

import User from "src/models/user";
import PersonalInformation from "src/models/personalInformation";
import ApplicationInformation from "src/models/applicationInformation";
import ProfilePicture from "src/models/profilePicture";
import PhoneNumber from "src/models/phoneNumber";
import Status from "src/models/status";
import Friend from "src/models/friend";

class OfflineDatabase{
  // _database:  Database
  // isSynchronizing: boolean
  
  static _database = null;
  static isSynchronizing = false;

  static initialize(){
    const schema = appSchema({
      version: 2,
      tables: [
        UsersSchema, PersonalInformationsSchema, ApplicationInformationsSchema,
        ProfilePicturesSchema, PhoneNumbersSchema, StatusesSchema, FriendsSchema
      ]
    });
  
    const adapter = new SQLiteAdapter({ schema });
    const database = new Database({
      adapter, actionsEnabled: true,
      modelClasses: [ 
        User, PersonalInformation, ApplicationInformation, ProfilePicture, PhoneNumber,
        Status, Friend
      ]
    })
    OfflineDatabase._database = database;
  }

  static async pullChanges({ lastPulledAt }){
    const response = await fetch(`${DB_SYNCHRONIZER}/sync?lastPulledAt=${lastPulledAt}`);
    if(!response.ok) return Promise.reject(await response.text());
  
    const { changes, timestamp } = await response.json();
    return { changes, timestamp };
  }

  static async pushChanges({ changes, lastPulledAt }){
    const response = await fetch(`${DB_SYNCHRONIZER}/sync?lastPulledAt=${lastPulledAt}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ changes })
    });
  
    if(!response.ok) return Promise.reject(await response.text())
    else return Promise.resolve();
  }
  
  static async synchronize(){
    try{
      Logger.log("OfflineDatabase.synchronize#isSynchronizing", OfflineDatabase.isSynchronizing);
      if(OfflineDatabase.isSynchronizing) return;
      else OfflineDatabase.isSynchronizing = true;
      await synchronize({
        database: OfflineDatabase.database,
        pullChanges: OfflineDatabase.pullChanges,
        pushChanges: OfflineDatabase.pushChanges
      });
    }catch(err){
      Logger.log("OfflineDatabase.synchronize#err", err.stack);
    }finally{
      OfflineDatabase.isSynchronizing = false;
    }
  }

  static get database(){
    if(!OfflineDatabase._database) OfflineDatabase.initialize();
    return OfflineDatabase._database;
  }
}

export default OfflineDatabase;