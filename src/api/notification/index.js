import firebase from "react-native-firebase";
import DiscussionAPI from "modules/Classroom/api/discussion";
import RoomsAPI from 'src/api/rooms';
import { withNavigation } from "react-navigation";

class NotificationAPI{

  static async doNotif (notificationOpen, currentUserEmail) {
    // App was opened by a notification
       // Get the action triggered by the notification being opened
       const action = notificationOpen.action;
       // Get information about the notification that was opened
       const notification = notificationOpen.notification;
       const data = notification.data
       if(data.type=="new-discussion"){
         const schoolId = data.schoolId
         const classId = data.classId
         const taskId = data.taskId
         const discussionId = data.discussionId
         const discussion = await DiscussionAPI.getDetail(schoolId, classId, taskId, discussionId, currentUserEmail)
         payload = {
           key:"Classroom",
           schoolId,
           classId,
           taskId,
           discussion
         }
         
         this.props.navigation.navigate("DiscussionComment", payload)
       }else if(data.type=="new-chat"){
         const roomId = data.roomId
         const room = await RoomsAPI.getDetail(roomId)
         payload = {
           room
         }
         this.props.navigation.navigate("Chat", payload);
       }
  }
}

export default withNavigation(NotificationAPI)