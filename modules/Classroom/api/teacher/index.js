import firebase from "react-native-firebase";

import {
  TeachersCollection,
  SchoolsCollection
} from "src/api/database/collection";

export default class TeacherAPI {
  static async addTeacher(schoolId, teacherEmail, data) {
    try {
      const db = firebase.firestore();
      const teachersCollection = new TeachersCollection();
      const schoolsCollection = new SchoolsCollection();
      const schoolRef = db
        .collection(schoolsCollection.getName())
        .doc(schoolId);
      const schoolTeacherRef = schoolRef
        .collection(teachersCollection.getName())
        .doc(teacherEmail);
      await schoolTeacherRef.set({
        creationTime: firebase.firestore.FieldValue.serverTimestamp(),
        isActive: false,
        ...data
      });
      return Promise.resolve(true);
    } catch (err) {
      console.log(err);
      return Promise.resolve(false);
    }
  }

  getTeachersWithRealTimeUpdate(schoolId, callback) {
    const db = firebase.firestore();
    const teachersCollection = new TeachersCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teacherListDoc = schoolRef.collection(teachersCollection.getName());
    return teacherListDoc.onSnapshot(querySnapshot => {
      if (!querySnapshot.empty) callback(querySnapshot.docs);
      else callback([]);
    });
  }

  async getDetail(schoolId, email, source = "default") {
    const db = new firebase.firestore();
    const teachersCollection = new TeachersCollection();
    const schoolsCollection = new SchoolsCollection();
    const schoolRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teacherRef = schoolRef.collection(teachersCollection.getName()).doc(email);
    const documentSnapshot = await teacherRef.get({ source });
    const userData = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return Promise.resolve(userData);
  }
}
