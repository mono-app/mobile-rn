import React from "react";
import { withCurrentUser } from "src/api/people/CurrentUser"
import firebase from "react-native-firebase";
import DiscussionAPI from "modules/Classroom/api/discussion";
import RoomsAPI from 'src/api/rooms';
import { withNavigation,StackActions,NavigationActions } from "react-navigation";

class NotificationListener extends React.PureComponent {
  
  doNotif = async (notificationOpen) => {
    // App was opened by a notification
       // Get the action triggered by the notification being opened
       const action = notificationOpen.action;
       // Get information about the notification that was opened
       const notification = notificationOpen.notification;
       const data = notification.data
       if(data.type=="new-discussion" || data.type=="discussion-comment"){
         const schoolId = data.schoolId
         const classId = data.classId
         const taskId = data.taskId
         const discussionId = data.discussionId
         const discussion = await DiscussionAPI.getDetail(schoolId, classId, taskId, discussionId, this.props.currentUser.id)
         payload = {
           isFromNotification: true,
           schoolId,
           classId,
           taskId,
           discussion
         }
        //  console.log(payload)
        //  const sa = StackActions.reset({
        //   index: 0,
        //   key:"HomeTab",
        //   actions: [ 
        //     NavigationActions.navigate({ routeName: "Home"}),
        //     ]
        // })
        //  //this.props.navigation.navigate("DiscussionComment", payload)
        //  this.props.navigation.dispatch(sa)
         this.props.navigation.navigate( "DiscussionComment", payload)
          
       }else if(data.type=="new-chat"){
         const roomId = data.roomId
         const room = await RoomsAPI.getDetail(roomId)
         payload = {
           room
         }
         this.props.navigation.navigate("Chat", payload);
       }else if(data.type=="new-groupchat"){
        const roomId = data.roomId
        const room = await RoomsAPI.getDetail(roomId)
        payload = {
          room
        }
        this.props.navigation.navigate("GroupChat", payload);
       }
       else if(data.type=="friend-request"){
          const userId = data.friendRequestFromUserId
          const payload = {
            peopleId: userId
          }
          this.props.navigation.navigate("PeopleInformation", payload);
       }else if(data.type=="birthday-reminder"){
          const roomId = data.roomId
          const room = await RoomsAPI.getDetail(roomId)
          const payload = {
            room
          }
          this.props.navigation.navigate("InboundOnlyChat", payload);
       }else if(data.type=="moment-comment"){
         const momentId = data.momentId
         const payload = {
          momentId
        }
         this.props.navigation.navigate("MomentComments", payload)
       }
  }

  constructor(props){
    super(props)
    this.doNotif = this.doNotif.bind(this)
    this.notificationOpenedListener = null
  }

  async componentDidMount(){
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      this.doNotif(notificationOpen)
    });

    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      this.doNotif(notificationOpen)
    }
  }
  
  componentWillUnmount() {
    if(this.notificationOpenedListener) this.notificationOpenedListener()
  }
  
  render(){
    return null
  }
}


export default withNavigation(withCurrentUser(NotificationListener))