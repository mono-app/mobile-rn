import { createConnection, getConnection } from "typeorm";

import { UserSchema } from "src/api/database/schemas";

function OfflineDatabase(){}

OfflineDatabase.connection = null;
OfflineDatabase.openConnection = async () => {
  await OfflineDatabase.closeConnection();
  OfflineDatabase.connection = await createConnection({
    type: "react-native", database: "mono", location: "default", 
    synchronize: true, logging: true,
    entities: [ UserSchema ]
  });
};

OfflineDatabase.closeConnection = async () => {
  if(OfflineDatabase.connection) await OfflineDatabase.connection.close();
}

export default OfflineDatabase;