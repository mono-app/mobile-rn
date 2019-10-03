const admin = require("firebase-admin");

function User(){}

User.getAll = async () => {
  const db = admin.firestore();
  const usersRef = await db.collection("users").get();
  const users = usersRef.docs.map((documentSnapshot) => User.normalize(documentSnapshot));
  return Promise.resolve(users);
};

User.normalize = (documentSnapshot) => {
  return { id: documentSnapshot.id, ...documentSnapshot.data() }
}

module.exports = User;