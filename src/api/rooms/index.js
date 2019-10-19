import firebase from "react-native-firebase";

import CurrentUserAPI from "src/api/people/CurrentUser";
import { RoomsCollection, RoomUserMappingCollection, MessagesCollection, Collection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { GetDocument } from "src/api/database/query";
import StudentAPI from "modules/Classroom/api/student";
import TeacherAPI from "modules/Classroom/api/teacher";

export default class RoomsAPI{
  constructor(){
    this.isRoomExists = this.isRoomExists.bind(this);
  }

  /**
   * @param {string} email
   * @param {Function} callback 
   */
  static getRoomsWithRealtimeUpdate(email, callback){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const roomsRef = db.collection(roomsCollection.getName()).where("audiences", "array-contains", email)
                       
    return roomsRef.onSnapshot((querySnapshot) => {
      const rooms = querySnapshot.docs.map((documentSnapshot) => {
        const normalizedRoom = RoomsAPI.normalizeRoom(documentSnapshot);
        return normalizedRoom;
      })
      const filteredRooms = rooms.filter((item)=>{
        return (item.type !=="bot" && !item.blocked && !item.hidden)
      })

      filteredRooms.sort((a, b) => ((a.lastMessage && b.lastMessage)&&a.lastMessage.sentTime < b.lastMessage.sentTime) ? 1 : -1)
      callback(filteredRooms);
    })
  }

  static async getDetail(roomId){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const roomsDocumentRef = db.collection(roomsCollection.getName()).doc(roomId);
    const documentSnapshot = await roomsDocumentRef.get();
    const data = { id: documentSnapshot.id, ...documentSnapshot.data() };
    return Promise.resolve(data);
  }

  static getDetailWithRealTimeUpdate(roomId, callback){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const roomsDocumentRef = db.collection(roomsCollection.getName()).doc(roomId);
    return roomsDocumentRef.onSnapshot((documentSnapshot)=> {
      const data = { id: documentSnapshot.id, ...documentSnapshot.data() };
      callback(data)
    });
  }

  static normalizeRoom(documentSnapshot){
    return { id: documentSnapshot.id, ...documentSnapshot.data() }
  }

  /**
   * 
   * @param {enum} type = the type of your room `private`
   * @param {string} audiences 
   * @return {Promise<Object>} - { isExists: <boolean>, documentId: <string> } `true` if the room is exists, together with its id or `false` if not exists
   */
  isRoomExists(type, audiences=[]){
    const roomsCollection = new RoomsCollection();
    let firebaseCollection = roomsCollection.getFirebaseReference();
    firebaseCollection = firebaseCollection.where("type", "==", type);
    audiences.forEach(audience => {
      firebaseCollection = firebaseCollection.where(
        new firebase.firestore.FieldPath("audiencesQuery", audience), "==", true
      )
    })

    const getQuery = new GetDocument();
    getQuery.setGetConfiguration("default");
    return getQuery.executeFirebaseQuery(firebaseCollection).then(snapshot => {
      if(snapshot.empty) return { isExists: false, documentId: null }
      else return { isExists: true, documentId: snapshot.docs[0].id }
    })
  }

  static async createGroupClassRoomIfNotExists(schoolId, classId){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const roomsRef = db.collection(roomsCollection.getName());

    const querySnapshot = await roomsRef.where("school.id", "==", schoolId).where("school.classId", "==", classId).get();
    if(querySnapshot.empty){
      const audiences = []
      const audiencesPayload = {}
      const students = await StudentAPI.getClassStudent(schoolId, classId)
      const teachers = await TeacherAPI.getClassTeachers(schoolId, classId)
      students.forEach(element => {
        if(!audiences.includes(element.id))
        {  
          audiences.push(element.id)
          audiencesPayload[element.id] = true;
        }
      })
      teachers.forEach(element => {
        if(!audiences.includes(element.id))
        {
          audiences.push(element.id)
          audiencesPayload[element.id] = true;
        }
      })
     
      const school = {id: schoolId, classId: classId};
      const payload = { 
        audiences,
        audiencesQuery: audiencesPayload,
        school, type: "group-chat",
        lastMessage: {message: "", sentTime: null},
        creationTime: firebase.firestore.FieldValue.serverTimestamp() 
      }

      const roomRef = db.collection(roomsCollection.getName()).doc();
      roomRef.set(payload);
      return Promise.resolve({ id: roomRef.id, ...payload });
    }else{
      const roomSnapshot = querySnapshot.docs[0]
      return Promise.resolve({ id: roomSnapshot.id, ...roomSnapshot.data() });

    }
  }

  static async setInRoomStatus(roomId, email, status){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();
    const roomsRef = db.collection(roomsCollection.getName()).doc(roomId);

    if(status){
      roomsRef.update({inRoom: firebase.firestore.FieldValue.arrayUnion(email)})
    }else{
      roomsRef.update({inRoom: firebase.firestore.FieldValue.arrayRemove(email)})
    }
    return Promise.resolve(true)
  }
}


export class PersonalRoomsAPI extends RoomsAPI{
  constructor(){ super(); }
  

  /**
   * 
   * @param {array} audiences
   */
  static async createRoomIfNotExists(firstPeopleEmail, secondPeopleEmail, type="chat"){
    const db = firebase.firestore();
    const roomsCollection = new RoomsCollection();

    const userPath = new firebase.firestore.FieldPath("audiencesQuery", firstPeopleEmail);
    const peoplePath = new firebase.firestore.FieldPath("audiencesQuery", secondPeopleEmail);
    const roomsRef = db.collection(roomsCollection.getName());
    const querySnapshot = await roomsRef.where(userPath, "==", true).where(peoplePath, "==", true).where('type','==',type).get();
    
    if(querySnapshot.empty){
      const audiencesPayload = {};
      audiencesPayload[firstPeopleEmail] = true;
      audiencesPayload[secondPeopleEmail] = true;
      const payload = { 
        audiences: [firstPeopleEmail, secondPeopleEmail], type: "chat",
        audiencesQuery: audiencesPayload, lastMessage: {message: "", sentTime: null},
        creationTime: firebase.firestore.FieldValue.serverTimestamp() 
      }

      const roomRef = db.collection(roomsCollection.getName()).doc();
      roomRef.set(payload);
      return Promise.resolve({ id: roomRef.id, ...payload });
    }else return Promise.resolve(RoomsAPI.normalizeRoom(querySnapshot.docs[0]));
  }

  
}