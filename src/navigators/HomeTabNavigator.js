import { createStackNavigator } from "react-navigation";

import HomeScreen from "src/screens/HomeScreen";
import AddContactScreen from "src/screens/AddContactScreen";
import PeopleInformationScreen from "src/screens/PeopleInformationScreen";
import PeopleSearchResult from "src/screens/PeopleSearchResult";
import FriendRequestListScreen from "src/screens/FriendRequestListScreen";
import ChatScreen from "src/screens/ChatScreen";
import InboundOnlyChatScreen from "src/screens/InboundOnlyChatScreen";
import GroupChatScreen from "src/screens/GroupChatScreen";
import NotificationBotScreen from "src/screens/NotificationBotScreen";
import MyQRScreen from "src/screens/MyQRScreen";
import ScanQRCodeSCreen from "src/screens/ScanQRCodeScreen";
import EditSingleFieldScreen from "src/screens/EditSingleFieldScreen";
import DiscussionClassroomNotifNavigatorObj from "modules/Classroom/navigators/DiscussionClassroomNotifNavigatorObj";
import MomentNavigatorObj from "modules/Moments/navigators/MomentNavigatorObj";

export default HomeTabNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  AddContact: { screen: AddContactScreen },
  ScanQRCode: { screen: ScanQRCodeSCreen },
  PeopleSearchResult: { screen: PeopleSearchResult },
  PeopleInformation: { screen: PeopleInformationScreen },
  FriendRequestList: { screen: FriendRequestListScreen },
  Chat: { screen: ChatScreen },
  InboundOnlyChat: { screen: InboundOnlyChatScreen },
  NotificationBot: { screen: NotificationBotScreen },
  GroupChat: { screen: GroupChatScreen },
  MyQR: { screen: MyQRScreen },
  EditSingleField: { screen: EditSingleFieldScreen },
  ...DiscussionClassroomNotifNavigatorObj,
  ...MomentNavigatorObj
}, {
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { tabBarVisible: (
      routeName !== "MomentComments" && routeName !== "Chat" && routeName !== "GroupChat" && routeName !== "WebRTC" && 
      routeName !== "GallerySwiper" && routeName !== "MapsPicker" && routeName !== "NotificationBot"
      )}
  }
})