import firebase from "react-native-firebase";
import OfflineDatabase from "src/api/database/offline";
import CustomError from "src/entities/error";
import lodashString from "lodash/string";
import { Q } from "@nozbe/watermelondb";

export default class Database{

  constructor(){ this.db = firebase.firestore(); }
  getDatabase(){ return this.db; }

  static chooseDatabase(online){
    if(online) return firebase.firestore();
    else return OfflineDatabase.database;
  }

  static async listen(func, online=true){ return await func(Database.chooseDatabase(online)) }
  static async insert(func, online=true){ return await func(Database.chooseDatabase(online)) }
  static async update(func, online=true){ return await func(Database.chooseDatabase(online)) }
  static async delete(func, online=true){ return await func(Database.chooseDatabase(online)) }
  static async get(func, online=false){ return await func(Database.chooseDatabase(online)) }

  static async synchronize(Model, changes){
    const database = Database.chooseDatabase(false);
    await database.action(async () => {
      const collection = database.collections.get(Model.table);
      const batchOperation = changes.updated.map((entity) => {
        return collection.prepareCreate((model) => entity.injectModel(model));
      })
      database.batch(batchOperation);
    })
  }
}
//   /**
//    * 
//    * @param {string} table 
//    * @param {object} changes 
//    * @param {boolean} online 
//    */
//   static async synchronize(table, changes, primaryKey="id", online=false){
//     if(online) await Database.synchornizeToOnline(table, changes, primaryKey, Database.chooseDatabase(online));
//     else await Database.synchronizeToOffline(table,changes, primaryKey, Database.chooseDatabase(online));
//   }

//   /**
//    * 
//    * @param {string} table 
//    * @param {object} changes 
//    * @param {string} primaryKey
//    * @param {WatermelonDB} database
//    */
//   static async synchronizeToOffline(table, changes, primaryKey, database){
//     const collections = database.collections.get(table);

//     const updatedPromises = changes.updated.map(async (entity) => {
//       const camelCasePrimaryKey = lodashString.camelCase(primaryKey);
//       let [ model ] = await collections.query(Q.where(primaryKey, entity[camelCasePrimaryKey])).fetch()

//       if(!model){
//         await database.action(async () => {
//           collections.create((model) => {
//             const fields = Object.keys(entity);
//             fields.forEach((field) => {
//               if(field === "id") model._raw.id = entity.id;
//               else model[field] = entity[field];
//             })
//           })
//         })
//       }else return model.prepareUpdate((model) => {
//         const fields = Object.keys(entity);
//         fields.forEach((field) => model._raw[field] = entity[field])
//       })
//     });

//     const deletedPromises = changes.deleted.map(async (entity) => {
//       const camelCasePrimaryKey = lodashString.camelCase(primaryKey);
//       const [ model ] = await collections.query(Q.where(primaryKey, entity[camelCasePrimaryKey])).fetch()
//       if(model) return model.prepareDestroyPermanently();
//       else return Promise.resolve(null);
//     })

//     // const updated = await Promise.all(updatedPromises);
//     // const deleted = await Promise.all(deletedPromises);
//     // const batchOperation = [ ...updated, ...deleted ];
//     // await database.action(async () => {
//     //   await database.batch(batchOperation);
//     // });
//   }

//   /**
//    * 
//    * @param {string} table 
//    * @param {object} changes 
//    * @param {Firestore} database
//    */
//   static async synchronizeToOnline(table, changes, database){ throw new CustomError("database/not-implemented", "This function is not implemented yet") }
// }