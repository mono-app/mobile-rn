import React from "react";
import { createStackNavigator } from "react-navigation";
import DiscussionCommentScreen from "modules/Classroom/screens/DiscussionCommentScreen"

export default NotificationNavigator = createStackNavigator(
  {
    DiscussionComment: {screen: DiscussionCommentScreen},
  }
);
