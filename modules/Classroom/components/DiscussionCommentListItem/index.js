import React from "react";
import moment from "moment";
import { Dimensions, View, FlatList } from "react-native";
import { Text, Caption, Paragraph } from "react-native-paper";
import ImageListItem from "src/components/ImageListItem"
import CircleAvatar from "src/components/Avatar/Circle";
import SchoolAPI from "modules/Classroom/api/school";
import Helper from "src/api/helper"

const INITIAL_STATE = { posterName: "", comment: {}, isLoading: true, profilePicture: Helper.getDefaultProfilePic() }

export default class DiscussionCommentListItem extends React.Component{

  refreshDetail = async () => {
    this.setState({ isLoading: true });
    const { comment, schoolId } = this.props;
    SchoolAPI.getUserDetails(schoolId, comment.posterId).then(people=>{
      this.setState({posterName: people.name})
      if(people.profilePicture && people.profilePicture.downloadUrl) this.setState({profilePicture: people.profilePicture.downloadUrl})
    })

    this.setState({ isLoading: false, comment });
  }

  handleOnImagePress = (index) => {
    this.props.onImagePress(index)
  }

  constructor(props){
    super(props);
    this.state = { ...INITIAL_STATE, ...this.props };
    this.refreshDetail = this.refreshDetail.bind(this);
    this.handleOnImagePress = this.handleOnImagePress.bind(this);
  }

  componentDidMount(){ this.refreshDetail(); }

  render(){
    const window = Dimensions.get("window");
    const imageSize = (window.width/3) + 10;

    if(this.state.isLoading) return <View/>
    const { comment } = this.state;

    const hasImage = (comment.images && comment.images.length > 0)
    let remainingImageCount = 0;
    if(comment.images && comment.images.length>4){
      remainingImageCount = comment.images.length-4;
    }
    
    let timeFromNow = moment(comment.creationTime.seconds*1000).format("DD MMMM YYYY HH:mm");
    

    return(
      <View style={{ marginTop: 8, borderBottomWidth:1, borderBottomColor: "#E8EEE8"}}>
          <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
            <CircleAvatar size={40} uri={this.state.profilePicture}/>
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontWeight: "700" }}>{this.state.posterName}</Text>
              <Caption style={{ marginTop: 0 }}>{timeFromNow}</Caption>
            </View>
          </View>
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <Paragraph>{comment.comment} 
            </Paragraph>
          </View>
          

          { hasImage?(
            <View style={{height: imageSize}}>
              <FlatList
              horizontal={true}
              style={{ backgroundColor: "white" }}
              data={comment.images}
              keyExtractor={(item) => item.storagePath}
              renderItem={({ item, index }) => {
                return (
                  <ImageListItem 
                    onPress={() => this.handleOnImagePress(index)}
                    image={item}/>
                )
              }}
            />
          </View>
          ):<View/>}
      
      </View>
    )
  }
}
