import Database from "./index";

export class Collection{
  /**
   * 
   * @param {String} name - a collection name
   */
  constructor(name){ this.name = name }

  getName(){return this.name}

  getFirebaseReference(database = new Database()){
    return database.getDatabase().collection(this.name);
  }
}

export class UserCollection extends Collection{
  constructor(){ super("users"); }
}

export class FriendRequestCollection extends Collection{
  constructor(){ super("friendRequest"); }
}

export class FriendListCollection extends Collection{
  constructor(){ super("friendList"); }
}

export class PeopleCollection extends Collection{
  constructor(){ super("people"); }
}

export class RoomsCollection extends Collection{
  constructor(){ super("rooms"); }
}

export class RoomUserMappingCollection extends Collection{
  constructor(){ super("roomUserMapping"); }
}

export class MessagesCollection extends Collection{ 
  constructor(){ super("messages"); }
}

export class MomentsCollection extends Collection{
  constructor(){ super("moments"); }
}

export class FansCollection extends Collection{
  constructor(){ super("fans"); }
}

export class CommentsCollection extends Collection{
  constructor(){ super("comments"); }
}

export class StatusCollection extends Collection{
  constructor(){ super("status"); }
}

export class SchoolsCollection extends Collection{
  constructor(){ super("schools"); }
}

export class ClassesCollection extends Collection{
  constructor(){ super("classes"); }
}

export class SchoolAdminsCollection extends Collection{
  constructor(){ super("schoolAdmins"); }
}

export class TeachersCollection extends Collection{
  constructor(){ super("teachers"); }
}

export class TempTeachersCollection extends Collection{
  constructor(){ super("tempTeachers"); }
}

export class StudentsCollection extends Collection{
  constructor(){ super("students"); }
}

export class TempStudentsCollection extends Collection{
  constructor(){ super("tempStudents"); }
}

export class TasksCollection extends Collection{
  constructor(){ super("tasks"); }
}

export class UserMappingCollection extends Collection{
  constructor(){ super("userMapping"); }
}

export class SubmissionsCollection extends Collection{
  constructor(){ super("submissions"); }
}

export class FilesCollection extends Collection{
  constructor(){ super("files"); }
}

export class DiscussionsCollection extends Collection{
  constructor(){ super("discussions"); }
}

export class LikesCollection extends Collection{
  constructor(){ super("likes"); }
}

export class AnnouncementsCollection extends Collection{
  constructor(){ super("announcements"); }
}

export class ParticipantsCollection extends Collection{
  constructor(){ super("participants"); }
}

export class BlockedCollection extends Collection{
  constructor(){ super("blocked"); }
}

export class HideCollection extends Collection{
  constructor(){ super("hide"); }
}

export class BlockedByCollection extends Collection{
  constructor(){ super("blockedBy"); }
}

export class InRoomCollection extends Collection{
  constructor(){ super("inRoom"); }
}

export class ContactSupportCollection extends Collection{
  constructor(){ super("contactSupport"); }
}
