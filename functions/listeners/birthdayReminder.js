const functions = require('firebase-functions');
const admin = require("firebase-admin");
const moment = require("moment");
const User = require("../lib/user");

function BirthdayReminder(){}

BirthdayReminder.BOT_NAME = "BirthdayReminder";
BirthdayReminder.schedule = functions.pubsub.schedule("every day 09:00").timeZone("Asia/Jakarta").onRun((context) => {
  await BirthdayReminder.normalizeDatabase();
  await BirthdayReminder.execute();
  return true;
});

BirthdayReminder.execute = async () => {
  const users = await User.getAll();

  // filter the user that has birthday setup
  // if the user does not has birthday setup, remind the user to setup the birthday
  // until the user setup the birthday, the user will not receive any friend's birthday reminder
  const noBirthdaySetupUsers = users.filter((user) => user.queryExists.birthday === false);
  const haveBirthdaySetupUsers = users.filter((user) => user.queryExists.birthday === true);
  await Promise.all([
    BirthdayReminder.reminderToSetup(noBirthdaySetupUsers),
    BirthdayReminder.reminderOfFriends(haveBirthdaySetupUsers)
  ]);
};

BirthdayReminder.reminderOfFriends = async (users) => {
  // TODO: code here after someone click the notification
}

BirthdayReminder.reminderToSetup = async (users) => {
  // send reminder to setup the birthday to user
  // if the room is not exists, create a room between the bot and the user
  const db = admin.firestore();
  const botQuery = new admin.firestore.FieldPath("audiencesQuery", BirthdayReminder.BOT_NAME);
  await Promise.all(users.map(async (user) => {
    const userQuery = new admin.firestore.FieldPath("audiencesQuery", user.id);
    const roomQuerySnapshot = await db.collection("rooms").where(botQuery, "==", true).where(userQuery, "==", true)
                                      .where("type", "==", "bot").get();
    if(roomQuerySnapshot.empty){
      const newRoomRef = db.collection("rooms").doc();
      await newRoomRef.set({
        audiences: [ BirthdayReminder.BOT_NAME, user.id ],
        audiencesQuery: { [BirthdayReminder.BOT_NAME]: true, [user.id]: true },
        bot: BirthdayReminder.BOT_NAME, creationTime: admin.firestore.FieldValue.serverTimestamp(),
        type: "bot"
      });
      await BirthdayReminder.sendBirthdaySetupReminder(newRoomRef);
    }else{
      const promises = roomQuerySnapshot.docs.map((documentSnapshot) => BirthdayReminder.sendBirthdaySetupReminder(documentSnapshot.ref))
      await Promise.all(promises);
    }
  }));
}

BirthdayReminder.sendBirthdaySetupReminder = async (roomRef) => {
  const messageRef = roomRef.collection("messages").doc();
  await messageRef.set({
    content: `Kamu belum menambahkan data ulang tahun. Tambahkan sekarang agar kamu juga bisa melihat ulang tahun teman kamu.`,
    senderEmail: BirthdayReminder.BOT_NAME, localSentTime: admin.firestore.Timestamp.fromMillis(new moment().valueOf()), 
    readBy: [], sentTime: admin.firestore.FieldValue.serverTimestamp(), type: "setup-birthday"
  });
}

BirthdayReminder.normalizeDatabase = async () => {
  const db = admin.firestore();
  const usersRef = await db.collection("users").get();

  const queryExistsPromises = [];
  usersRef.forEach((documentSnapshot) => {
    const user = User.normalize(documentSnapshot);
    if(user.personalInformation === undefined) return;
    if(user.personalInformation.birthday !== undefined){
      queryExistsPromises.push(documentSnapshot.ref.update({ "queryExists.birthday": true }))
    }else{
      queryExistsPromises.push(documentSnapshot.ref.update({ "queryExists.birthday": false }))
    }
  });
  await Promise.all(queryExistsPromises);
}
module.exports = BirthdayReminder;