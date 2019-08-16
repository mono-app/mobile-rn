import firebase from "react-native-firebase";

import { SchoolsCollection, StudentsCollection, AnnouncementsCollection } from "src/api/database/collection";

export default class AnnouncementAPI{

  static async getStudentAnnouncements(schoolId, studentId) {
   
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const studentsCollection = new StudentsCollection();
    const announcementsCollection = new AnnouncementsCollection();
  
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(studentId);
    const announcementsDocumentRef = studentsDocumentRef.collection(announcementsCollection.getName()).orderBy('task.dueDate','asc')

    const announcementsQuerySnapshot = await announcementsDocumentRef.get();
  
    const announcements =  (await announcementsQuerySnapshot.docs).map((snap) => {
      return {id: snap.id, ...snap.data()}
    });
    return Promise.resolve(announcements);
  }

 
}