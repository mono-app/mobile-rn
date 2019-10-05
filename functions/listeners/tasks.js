const functions = require('firebase-functions');
const admin = require("firebase-admin");

function Tasks(){}

Tasks.triggerNewTask = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}").onCreate(async (documentSnapshot, context) => {
  const taskDocument = documentSnapshot.data();
  const { schoolId, classId, taskId } = context.params;

  // add to announcement every student
  const db = admin.firestore();
  const schoolDocumentRef = db.collection("schools").doc(schoolId)
  const classDocumentRef = schoolDocumentRef.collection("classes").doc(classId)
  const classDocumentSnapshot = await classDocumentRef.get()
  const classData = classDocumentSnapshot.data()
  const studentCollection = classDocumentRef.collection("students")
  const studentQuerySnapshot = await studentCollection.get()

  const arrayOfPromise = studentQuerySnapshot.docs.map(async (snap) => {
    const studentDocumentRef = schoolDocumentRef.collection("students").doc(snap.id)
    const announcementRef = studentDocumentRef.collection("announcements").doc()
    await announcementRef.set({
      type: "task", 
      task: {id: taskId, title: taskDocument.title, dueDate: taskDocument.dueDate}, 
      class: {id: classDocumentSnapshot.id, subject: classData.subject},
      creationTime: admin.firestore.FieldValue.serverTimestamp()  
    })
    return Promise.resolve(true)
  });
  await Promise.all(arrayOfPromise);


})
Tasks.triggerUpdatedTask = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}").onUpdate(async (change, context) => {
  const taskDocument = change.after.data();
  const { schoolId, classId, taskId } = context.params;

  // add to announcement every student
  const db = admin.firestore();
  const schoolDocumentRef = db.collection("schools").doc(schoolId)
  const classDocumentRef = schoolDocumentRef.collection("classes").doc(classId)
  const classDocumentSnapshot = await classDocumentRef.get()
  const classData = classDocumentSnapshot.data()
  const studentCollection = classDocumentRef.collection("students")
  const studentQuerySnapshot = await studentCollection.get()

  const arrayOfPromise = studentQuerySnapshot.docs.map(async (snap) => {
    const studentDocumentRef = schoolDocumentRef.collection("students").doc(snap.id)
    const announcementQuerySnapshot = await studentDocumentRef.collection("announcements").where("class.id","==",classDocumentSnapshot.id)
                            .where("task.id","==", taskId).get()
    if(announcementQuerySnapshot.empty){
      const announcementRef = studentDocumentRef.collection("announcements").doc()
      await announcementRef.set({
        type: "task", 
        task: {id: taskId, title: taskDocument.title, dueDate: taskDocument.dueDate}, 
        class: {id: classDocumentSnapshot.id, subject: classData.subject},
        creationTime: admin.firestore.FieldValue.serverTimestamp()  
      })
    }else{
      const announcementSnapshot = announcementQuerySnapshot.docs[0]
      const announcementRef = announcementSnapshot.ref
      await announcementRef.update({
        type: "task", 
        task: {id: taskId, title: taskDocument.title, dueDate: taskDocument.dueDate}, 
      })
    }
    
    return Promise.resolve(true)
  });
  await Promise.all(arrayOfPromise);


})


Tasks.triggerDeletedTask = functions.region("asia-east2").firestore.document("/schools/{schoolId}/classes/{classId}/tasks/{taskId}").onDelete(async (documentSnapshot, context) => {
  const { schoolId, classId, taskId } = context.params;

  // add to announcement every student
  const db = admin.firestore();
  const schoolDocumentRef = db.collection("schools").doc(schoolId)
  const classDocumentRef = schoolDocumentRef.collection("classes").doc(classId)
  const classDocumentSnapshot = await classDocumentRef.get()
  const studentCollection = classDocumentRef.collection("students")
  const studentQuerySnapshot = await studentCollection.get()

  const arrayOfPromise = studentQuerySnapshot.docs.map(async (snap) => {
    const studentDocumentRef = schoolDocumentRef.collection("students").doc(snap.id)
    const announcementQuerySnapshot = await studentDocumentRef.collection("announcements").where("class.id","==",classDocumentSnapshot.id)
                            .where("task.id","==", taskId).get()
    if(!announcementQuerySnapshot.empty){
      const announcementSnapshot = announcementQuerySnapshot.docs[0]
      await announcementSnapshot.ref.delete()
    }
    
    return Promise.resolve(true)
  });
  await Promise.all(arrayOfPromise);


})


module.exports = Tasks;