import uuid from "uuid/v4";
import Logger from "src/api/logger";
import { createConnection } from "typeorm";

import { UserSchema } from "src/api/database/schemas";

function OfflineDatabase(){}

OfflineDatabase.eventListeners = {};
OfflineDatabase.connection = null;
OfflineDatabase.removeEventListener = (id) => delete OfflineDatabase.eventListeners[id];
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

OfflineDatabase.addEventListener = (event, schema, callback) => {
  const id = uuid();
  const payload = { [id]: {event, schema, callback} }
  OfflineDatabase.eventListeners = Object.assign(OfflineDatabase.eventListeners, payload);
  Logger.log("OfflineDatabase.addEventListener#eventListeners", OfflineDatabase.eventListeners);
  return id;
}

OfflineDatabase.triggerEvent = (event, schema) => {
  const listeners = Object.keys(OfflineDatabase.eventListeners).map((id) => {
    const listener = OfflineDatabase.eventListeners[id];
    if(listener.event === event && listener.schema === schema) return listener;
    else return null;
  }).filter((listener) => listener !== null);

  Logger.log("OfflineDatabase.triggerEvent#listeners", listeners);
  listeners.forEach((listener) => {
    if(listener.callback) listener.callback();
  });
}

export default OfflineDatabase;