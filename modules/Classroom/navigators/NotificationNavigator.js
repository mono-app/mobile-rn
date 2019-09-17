import React from "react";
import { createStackNavigator } from "react-navigation";
import DiscussionCommentScreen from "modules/Classroom/screens/DiscussionCommentScreen"
import ShareDiscussionScreen from "modules/Classroom/screens/ShareDiscussionScreen"

export default NotificationNavigator = createStackNavigator(
  {
    DiscussionComment: {screen: DiscussionCommentScreen},
    ShareDiscussion: {screen: ShareDiscussionScreen},
  }
);
