import firebase from "react-native-firebase";

export default class StorageAPI{

  /**
   * 
   * @param {String} storagePath - Firebase storage path
   * @param {String} filePath - local storage path, it will remove file:// bydefault, so include it
   * @returns {String} - a string of download url
   */
  static uploadFile(storagePath, filePath){
    const storage = firebase.storage();
    const storageRef = storage.ref(storagePath);
    const cleanFilePath = filePath.substring(7);
    return storageRef.putFile(cleanFilePath).then(() => {
      return storageRef.getDownloadURL();
    });
  }

  /**
   * @param {String} storagePath - Firebase Storage path
   */
  static getDownloadURL(storagePath){
    const storage = firebase.storage();
    const storageRef = storage.ref(storagePath);
    return storageRef.getDownloadURL();
  }
}