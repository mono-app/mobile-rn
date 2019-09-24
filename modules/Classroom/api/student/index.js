import firebase from "react-native-firebase";

import { StudentsCollection, SchoolsCollection, UserMappingCollection, ClassesCollection, UserCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";

export default class StudentAPI{

  async addStudent(schoolId, studentEmail, data){
    try{
      const db = firebase.firestore();
      const studentsCollection = new StudentsCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
      const schoolStudentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(studentEmail);
      await schoolStudentRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), isActive: false, ...data });

      // insert to userMapping
      const userMappingCollection = new UserMappingCollection();
      const userMappingRef = db.collection(userMappingCollection.getName()).doc(studentEmail);
      const userMappingSchoolRef = userMappingRef.collection(schoolsCollection.getName()).doc(schoolId);
      await userMappingSchoolRef.set({ creationTime: firebase.firestore.FieldValue.serverTimestamp(), role:"student" });

      
      return Promise.resolve(true);
    }catch(err){ 
      return Promise.resolve(false); 
    }
  }

  
  static async addStudentClass(studentEmail, schoolId, classId){
    try {
      const db = firebase.firestore();
      
      const userMappingCollection = new UserMappingCollection()
      const classesCollection = new ClassesCollection()
      const schoolsCollection = new SchoolsCollection()
      const studentsCollection = new StudentsCollection()
      const schoolDocument = new Document(schoolId);
      const studentDocument = new Document(studentEmail);
      const classDocument = new Document(classId);

      await db.collection(schoolsCollection.getName())
              .doc(schoolDocument.getId())
              .collection(classesCollection.getName())
              .doc(classDocument.getId())
              .collection(studentsCollection.getName())
              .doc(studentDocument.getId())
              .set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() })

      await db.collection(userMappingCollection.getName())
              .doc(studentDocument.getId())
              .collection(schoolsCollection.getName())
              .doc(schoolDocument.getId())
              .collection(classesCollection.getName())
              .doc(classDocument.getId())
              .set({ creationTime: firebase.firestore.FieldValue.serverTimestamp() })

      return Promise.resolve(true);
    } catch (err) {
      return Promise.resolve(false);
    }
  }

  static async saveFinalScoreStudent(schoolId, classId, studentId, updateObject){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    const studentsDocumentRef = classesDocumentRef.collection(studentsCollection.getName()).doc(studentId);
    await studentsDocumentRef.update(updateObject)
    return Promise.resolve(true);
  }

  
  static async getStudents(schoolId) {
    const db = firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsCollectionRef = schoolsDocumentRef.collection(studentsCollection.getName()).orderBy("name", "asc");
    const studentSnapshot = await studentsCollectionRef.get();
    const studentDocuments = (await studentSnapshot.docs).map((snap) => {
      return {id: snap.id, ...snap.data()}
    });

    return Promise.resolve(studentDocuments);
  
  }

  static async updateDiscussionNotification(studentId, discussionId, isAllowNotif){

    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const usersDocumentRef = db.collection(userCollection.getName()).doc(studentId);

    if(isAllowNotif){
      await usersDocumentRef.update({settings: {ignoreNotifications: {discussions: firebase.firestore.FieldValue.arrayRemove({id: discussionId})}}})
    }else{
      const docSnapshot = await usersDocumentRef.get()
      const data = docSnapshot.data()

      if(data.settings && 
        data.settings.ignoreNotifications && 
        data.settings.ignoreNotifications.discussions && data.settings.ignoreNotifications.discussions.length>0){
          let newArray = JSON.parse(JSON.stringify(data.settings.ignoreNotifications.discussions))
          let allowPush = true
          for(const obj of newArray){
            if(obj.id==discussionId){
              allowPush=false
              break
            }
          }
          if(allowPush){
            newArray.push({id: discussionId})
            await usersDocumentRef.update({settings: {ignoreNotifications: {discussions: newArray}}})
          }
         
      }else{
        await usersDocumentRef.update({settings: {ignoreNotifications: {discussions: firebase.firestore.FieldValue.arrayUnion({id: discussionId})}}})
      }
    }
    return Promise.resolve(true);
  }

  static async getClassStudent(schoolId, classId){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const classesCollection = new ClassesCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection(classesCollection.getName()).doc(classId);
    let studentsCollectionRef = classesDocumentRef.collection(studentsCollection.getName());

    const studentSnapshot = await studentsCollectionRef.get();
    const arrayOfPromise = studentSnapshot.docs.map(async (snap) => {
      const student = await StudentAPI.getDetail(schoolId, snap.id)
      return Promise.resolve({...student, finalScore: snap.data().finalScore})
    });

    
    const studentDocuments = await Promise.all(arrayOfPromise);
    studentDocuments.sort((a, b) => ((a.name && b.name)&&a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)

    return Promise.resolve(studentDocuments);
  }

  static async getDetail(schoolId, email) {
    const db = firebase.firestore();
    const studentsCollection = new StudentsCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(email);
    const documentSnapshot = await studentsDocumentRef.get();
    const data = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(data);
  }
  
  static async updateProfilePicture(schoolId, studentId, storagePath, downloadUrl){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(studentId);
  
    await studentsDocumentRef.update({ "profilePicture": {storagePath, downloadUrl}})
    return Promise.resolve(true)
  }

  static async isStudent(schoolId, userEmail){
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(userEmail);
    const studentsSnapshot = await studentsDocumentRef.get();

    return Promise.resolve(studentsSnapshot.exists);
  }


  static async aa(){

    // ini untuk testing saja
    const schoolId = "1hZ2DiIYSFa5K26oTe75"
    const classId = "NWNfzx09U8HpxfXZMAEM"
    const taskId = "J76mQkaDnBqGqY4SLr7K"
    //const discussionId = "isiUsKggIRg3pVCVoZVh"
    const discussionId = "zJEZbx6Mu1iHy1vxQG2P"

    // get senderId
    const senderId = "test.kedua@gmail.com"
  
    // get creator Discussion Email
    
  
    // get all teacher audience
    const db = firebase.firestore();
    const schoolsDocumentRef = db.collection("schools").doc(schoolId);
    const classesDocumentRef = schoolsDocumentRef.collection("classes").doc(classId);
    const tasksDocumentRef = classesDocumentRef.collection("tasks").doc(taskId)
    const discussionsDocumentRef = tasksDocumentRef.collection("discussions").doc(discussionId)
    const participantsCollectionRef = discussionsDocumentRef.collection("participants")
  
    // get creator Discussion Email
  const discussionDocumentSnapshot = await discussionsDocumentRef.get();
  const creatorEmail = discussionDocumentSnapshot.data().posterEmail
  const creatorDocumentRef = db.collection("users").doc(creatorEmail);
  const creatorDocumentSnapshot = await creatorDocumentRef.get();
  const creator = Object.assign({id: creatorDocumentSnapshot.id}, creatorDocumentSnapshot.data())


    const participantsQuerySnapshot = await participantsCollectionRef.get()
  
    const arrayOfPromise = participantsQuerySnapshot.docs.map( async (snap) => {
      const userDocumentRef = db.collection("users").doc(snap.id);
      const documentSnapshot = await userDocumentRef.get();
      const user = Object.assign({id: documentSnapshot.id}, documentSnapshot.data())

      return Promise.resolve(user)
    });
    const participants = await Promise.all(arrayOfPromise);
    
    participants.push(creator)

    let audiencesData = []
  
    for(const participant of participants){
      if(participant.id !== senderId){
        let allow = true
        if(participant.settings && participant.settings.ignoreNotifications && participant.settings.ignoreNotifications.discussions){
         
          for(var i = 0; i < participant.settings.ignoreNotifications.discussions.length; i++) {
            if (participant.settings.ignoreNotifications.discussions[i].id === discussionId) {
              allow = false
              break;
            }
          }
        }
        
        if(allow){
          audiencesData.push(participant)
        }
      }
    }
  }

  static async bb(){
    // get all audiences except sender
    const db = firebase.firestore();
    const roomId = "8EgYP0psuW8JzUpY6YX9"
    const senderEmail = "test.pertama@gmail.com"
    const roomRef = db.collection("rooms").doc(roomId);
    const roomSnapshot = await roomRef.get();
    const roomDocument = roomSnapshot.data();
    const audiences =  roomDocument.audiences.filter( (audience)=>{
      return audience !== senderEmail
    })

    // get all audiences messagingToken  
    const promises = audiences.map(audience => {
      const userRef = db.collection("users").doc(audience);
      return userRef.get();
    })
    const audiencesSnapshot = await Promise.all(promises);
    const audiencesData = audiencesSnapshot.map(audienceSnapshot => {
      const audienceData = audienceSnapshot.data();
      
      if(audienceData.tokenInformation){
        if(audienceData.tokenInformation.messagingToken) return audienceData;
      }
    });

  }

}
