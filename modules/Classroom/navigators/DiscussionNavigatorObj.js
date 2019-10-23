import DiscussionCommentScreen from "modules/Classroom/screens/DiscussionCommentScreen"
import ShareDiscussionScreen from "modules/Classroom/screens/ShareDiscussionScreen"
import AddDiscussionScreen from "modules/Classroom/screens/AddDiscussionScreen"
import DiscussionsScreen from "modules/Classroom/screens/DiscussionsScreen"

export default DiscussionNavigatorObj = {
    AddDiscussion: {screen: AddDiscussionScreen, navigationOptions:{ header: null }},
    Discussions: {screen: DiscussionsScreen, navigationOptions:{ header: null }},
    DiscussionComment: {screen: DiscussionCommentScreen, navigationOptions:{ header: null }},
    ShareDiscussion: {screen: ShareDiscussionScreen, navigationOptions:{ header: null }},
  }

