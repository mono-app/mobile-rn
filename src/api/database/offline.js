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

import User from "src/models/user";
import PersonalInformation from "src/models/personalInformation";
import ApplicationInformation from "src/models/applicationInformation";
import ProfilePicture from "src/models/profilePicture";
import PhoneNumber from "src/models/phoneNumber";

function OfflineDatabase(){}

OfflineDatabase.adapter = null;
OfflineDatabase.database = null;
OfflineDatabase.schema = null;
OfflineDatabase.isSynchronizing = false;
OfflineDatabase.initialize = () => {
  OfflineDatabase.schema = appSchema({
    version: 1,
    tables: [
      UsersSchema, PersonalInformationsSchema, ApplicationInformationsSchema,
      ProfilePicturesSchema, PhoneNumbersSchema
    ]
  })

  OfflineDatabase.adapter = new SQLiteAdapter({ schema: OfflineDatabase.schema });
  OfflineDatabase.database = new Database({
    adapter: OfflineDatabase.adapter, actionsEnabled: true,
    modelClasses: [ User, PersonalInformation, ApplicationInformation, ProfilePicture, PhoneNumber ]
  })
  OfflineDatabase.synchronize();
}

OfflineDatabase.pullChanges = async ({ lastPulledAt }) => {
  const response = await fetch(`${DB_SYNCHRONIZER}/sync?lastPulledAt=${lastPulledAt}`);
  if(!response.ok) return Promise.reject(await response.text());

  const { changes, timestamp } = await response.json();
  return { changes, timestamp };
}

OfflineDatabase.pushChanges = async ({ changes, lastPulledAt }) => {
  const response = await fetch(`${DB_SYNCHRONIZER}/sync?lastPulledAt=${lastPulledAt}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ changes })
  });

  if(!response.ok) return Promise.reject(await response.text())
  else return Promise.resolve();
}

OfflineDatabase.synchronize = async () => {
  try{
    Logger.log("OfflineDatabase.synchronize#isSynchronizing", OfflineDatabase.isSynchronizing);
    if(OfflineDatabase.isSynchronizing) return;
    else OfflineDatabase.isSynchronizing = true;
    await synchronize({
      database: OfflineDatabase.database,
      pullChanges: OfflineDatabase.pullChanges,
      pushChanges: OfflineDatabase.pushChanges
    });
  }finally{
    OfflineDatabase.isSynchronizing = false;
  }
}

export default OfflineDatabase;