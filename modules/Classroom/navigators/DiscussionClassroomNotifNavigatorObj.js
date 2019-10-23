import DiscussionCommentScreen from "modules/Classroom/screens/DiscussionCommentScreen"
import ShareDiscussionScreen from "modules/Classroom/screens/ShareDiscussionScreen"
import MapsPickerScreen from "src/screens/MapsPickerScreen"
import GallerySwiperScreen from "src/screens/GallerySwiperScreen"

export default DiscussionClassroomNotifNavigatorObj = {
  DiscussionComment: {screen: DiscussionCommentScreen, navigationOptions:{ header: null }},
  ShareDiscussion: {screen: ShareDiscussionScreen, navigationOptions:{ header: null }},
  MapsPicker: {screen: MapsPickerScreen, navigationOptions:{ header: null }},
  GallerySwiper: {screen: GallerySwiperScreen, navigationOptions:{ header: null }},
}