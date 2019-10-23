const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const RequestContact = require("./requests/contact");
const BirthdayReminder = require("./listeners/birthdayReminder");
const Messages = require("./listeners/messages");
const Friends = require("./listeners/friends");
const Discussions = require("./listeners/discussions");
const Student = require("./listeners/student");
const Teacher = require("./listeners/teacher");
const Tasks = require("./listeners/tasks");
const Moments = require("./listeners/moments");
const Room = require("./listeners/room");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-app-fdf76.firebaseio.com",
})

exports.contactService = functions.https.onRequest(RequestContact.request);
exports.schedulerBirthdayReminder = BirthdayReminder.schedule;

exports.triggerNewMessage = Messages.triggerNewMessage;
exports.sendNotificationForNewMessage = Messages.sendNotificationForNewMessage;

exports.triggerNewRoom = Room.triggerNewRoom;
exports.requestRoomToken = Room.requestRoomToken;

exports.triggerNewFriendRequest = Friends.triggerNewFriendRequest;
exports.addFriendTrigger = Friends.addFriendTrigger;
exports.deleteFriendTrigger = Friends.deleteFriendTrigger
exports.sendNotificationForNewFriendRequest = Friends.sendNotificationForNewFriendRequest;
exports.triggerBlockFriends = Friends.triggerBlockFriends
exports.triggerUnblockFriends = Friends.triggerUnblockFriends
exports.triggerHideFriends = Friends.triggerHideFriends
exports.triggerUnhideFriends = Friends.triggerUnhideFriends

exports.sendNotificationForNewDiscussion = Discussions.sendNotificationForNewDiscussion;
exports.sendNotificationForNewDiscussionComment = Discussions.sendNotificationForNewDiscussionComment;
exports.triggerNewDiscussion = Discussions.triggerNewDiscussion;
exports.triggerNewDiscussionComment = Discussions.triggerNewDiscussionComment

exports.addStudentClassTrigger = Student.addStudentClassTrigger;
exports.deletedStudentClassTrigger = Student.deletedStudentClassTrigger;

exports.addTeacherClassTrigger = Teacher.addTeacherClassTrigger;
exports.deletedTeacherClassTrigger = Teacher.deletedTeacherClassTrigger;

exports.triggerNewTask = Tasks.triggerNewTask
exports.triggerUpdatedTask = Tasks.triggerUpdatedTask
exports.triggerDeletedTask = Tasks.triggerDeletedTask

exports.triggerNewMoment = Moments.triggerNewMoment
exports.sendNotificationForNewMomentComment = Moments.sendNotificationForNewMomentComment