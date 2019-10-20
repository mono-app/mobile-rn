import uuid from "uuid/v4";
import Logger from "src/api/logger";
import { createConnection } from "typeorm";

import { DocumentSchema } from "src/api/database/schemas";

function OfflineDatabase(){}

OfflineDatabase.eventListeners = {};
OfflineDatabase.connection = null;
OfflineDatabase.removeEventListener = (id) => delete OfflineDatabase.eventListeners[id];
OfflineDatabase.openConnection = async () => {
  await OfflineDatabase.closeConnection();
  OfflineDatabase.connection = await createConnection({
    type: "react-native", database: "mono", location: "default", logging: true,
    entities: [ DocumentSchema ]
  });
};

OfflineDatabase.closeConnection = async () => {
  if(OfflineDatabase.connection) await OfflineDatabase.connection.close();
}

OfflineDatabase.addEventListener = (event, collection, callback) => {
  const id = uuid();
  const payload = { [id]: {event, collection, callback} }
  OfflineDatabase.eventListeners = Object.assign(OfflineDatabase.eventListeners, payload);
  Logger.log("OfflineDatabase.addEventListener#eventListeners", OfflineDatabase.eventListeners);
  return id;
}

OfflineDatabase.triggerEvent = (event, collection) => {
  const listeners = Object.keys(OfflineDatabase.eventListeners).map((id) => {
    const listener = OfflineDatabase.eventListeners[id];
    if(listener.event === event && listener.collection === collection) return listener;
    else return null;
  }).filter((listener) => listener !== null);

  Logger.log("OfflineDatabase.triggerEvent#listeners", listeners);
  listeners.forEach((listener) => {
    if(listener.callback) listener.callback();
  });
}

export default OfflineDatabase;