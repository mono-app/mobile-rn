import { Database } from  "./index";

export class DocumentListener{
  constructor(database = new Database()){
    this.database = database;
    this.listenerOptions = { includeMetadataChanges: false };
  }

  setListenerOptions(options){ this.listenerOptions = {...options}; };

  /**
   * 
   * @param {Collection} collection 
   * @param {Document} firebaseDocument 
   * @param {function} callback 
   */
  listen(collection, firebaseDocument, callback){
    return this.database.getDatabase()
                        .collection(collection.getName())
                        .doc(firebaseDocument.getId())
                        .onSnapshot(callback);
  }
}