import firebase from "react-native-firebase";

export class Database{
  constructor(){ this.db = firebase.firestore(); }
  getDatabase(){ return this.db; }
}
