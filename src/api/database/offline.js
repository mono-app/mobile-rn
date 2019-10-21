import { appSchema, Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

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
}

export default OfflineDatabase;