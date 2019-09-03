import React from "react";
import { Dimensions, View, FlatList, StyleSheet, PermissionsAndroid } from "react-native";
import { ActivityIndicator, Dialog, Text, Card, Caption, Paragraph } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import DiscussionAPI from "modules/Classroom/api/discussion";
import {  TouchableOpacity } from "react-native-gesture-handler";
import SquareAvatar from "src/components/Avatar/Square";
import FastImage from "react-native-fast-image";
import moment from "moment";
import TextInput from "src/components/TextInput";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import Button from "src/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import StudentAPI from "modules/Classroom/api/student";
import CommentListItem from "src/components/CommentListItem";
import DeleteDialog from "src/components/DeleteDialog";
import ImagePickerListItem from "src/components/ImagePickerListItem"
import DocumentPicker from 'react-native-document-picker';
import uuid from "uuid/v4"
import { withCurrentUser } from "src/api/people/CurrentUser"

const INITIAL_STATE = { 
  isLoading: true, 
  isSendingComment: false,
  discussion: {}, 
  comment:"", 
  commentList: [],
  imagesPicked: [],
  selectedImageToDelete: {},
  showDeleteImageDialog: false,
  locationCoordinate: null
};
class DiscussionCommentScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title={navigation.getParam("discussion", "").title}
          subtitle="0 partisipan"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadDiscussion = async () => {
    this.setState({ isLoading: true });
    const student = await StudentAPI.getDetail(this.schoolId, this.discussion.posterEmail)
    const currentUserEmail = this.props.currentUser.email
    const currentStudent = await StudentAPI.getDetail(this.schoolId, currentUserEmail)

    this.setState({ isLoading: false, discussion: this.discussion, posterName: student.name, dicussionNotification: currentStudent.dicussionNotification });
  }

  loadComments = async () => {
    this.setState({ isLoading:true, commentList: [] })
    const commentList = await DiscussionAPI.getComments(this.schoolId, this.classId, this.taskId, this.discussion.id);
    this.setState({ commentList, isLoading:false })
  }

  handleCommentChange = comment => {
    this.setState({ comment })
  }

  requestStoragePermission = async () => {
    try {
      await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
      );
     
    } catch (err) {
      console.warn(err);
    }
  }

  handleSendCommentPress = async () => {
    this.setState({ isSendingComment:true })
    const currentUserEmail = this.props.currentUser.email

    data = {
      comment: this.state.comment,
      posterEmail: currentUserEmail,
      location: {...this.state.locationCoordinate},
      images: this.state.imagesPicked
    }

    await DiscussionAPI.sendComment(this.schoolId, this.classId, this.taskId, this.discussion.id, data)
    await this.loadComments();
    this.setState({ comment:"", isSendingComment:false, locationCoordinate: null, imagesPicked: [] })
  }

  handlePicturePress = (images) => {
    payload = {
      images: images
    }
    this.props.navigation.navigate("GallerySwiper", payload);
  }

  handleLocationPress = () => {
    const payload = {
      onRefresh:(locationCoordinate)=> {
        this.setState({locationCoordinate})
        }
    }
    this.props.navigation.navigate("MapsPicker",payload)
  }

  handleCameraPress = async () => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await this.requestStoragePermission()
      return
    }
    const payload = {
      onRefresh:(image)=> {
          let clonedImagesPicked = JSON.parse(JSON.stringify(this.state.imagesPicked))
          clonedImagesPicked.push({id: uuid(), ...image})
          this.setState({imagesPicked: clonedImagesPicked})
        }
    }
    this.props.navigation.navigate("Camera",payload)
  }

  handleMultipleImagePress = async () => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await this.requestStoragePermission()
      return
    }
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      let clonedImagesPicked = JSON.parse(JSON.stringify(this.state.imagesPicked))
      for (const res of results) {
        clonedImagesPicked.push({id: uuid(), ...res})
      }
     
      this.setState({imagesPicked: clonedImagesPicked})
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  handleDeleteImagePress = (item) => {
    this.setState({selectedImageToDelete: item})
    this.deleteDialog.toggleShow()
  }

  onDeletePress = () => {
    const newselectedImageToDelete = this.state.imagesPicked.filter((image) => {
      return image.id!= this.state.selectedImageToDelete.id
    })
    this.setState({imagesPicked: []})
    this.setState({imagesPicked: newselectedImageToDelete})
    this.deleteDialog.toggleShow()
  }  

  handleSharePress = () => {
    const payload = {
      schoolId: this.schoolId,
      classId: this.classId
    }
    this.props.navigation.navigate("ShareDiscussion", payload)
  }

  handleNotifPress = async () => {
    const isAllowNotification = this.checkNotifAllowed()

    if(isAllowNotification){
      await StudentAPI.updateDiscussionNotification(this.props.currentUser.email,this.discussion.id, false);
    }else{
      await StudentAPI.updateDiscussionNotification(this.props.currentUser.email,this.discussion.id, true);
    }

  }

  checkNotifAllowed = () => {
    let isAllowNotification = true
    if(this.props.currentUser.settings && 
      this.props.currentUser.settings.ignoreNotifications && 
      this.props.currentUser.settings.ignoreNotifications.discussions){
        for(const obj of this.props.currentUser.settings.ignoreNotifications.discussions){
      
          if(obj.id==this.discussion.id){
            isAllowNotification=false
            break;
          }
        }
    }
    return isAllowNotification
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.discussion = this.props.navigation.getParam("discussion", "");
    this.loadDiscussion = this.loadDiscussion.bind(this);
    this.loadComments = this.loadComments.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSendCommentPress = this.handleSendCommentPress.bind(this);
    this.checkNotifAllowed = this.checkNotifAllowed.bind(this);
    this.handlePicturePress = this.handlePicturePress.bind(this);
    this.handleLocationPress = this.handleLocationPress.bind(this);
    this.handleMultipleImagePress = this.handleMultipleImagePress.bind(this);
    this.handleDeleteImagePress = this.handleDeleteImagePress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.handleCameraPress = this.handleCameraPress.bind(this);
    this.requestStoragePermission = this.requestStoragePermission.bind(this);
    this.handleSharePress = this.handleSharePress.bind(this);
    this.deleteDialog = null
  }

  componentDidMount(){
    this.loadDiscussion();
    this.loadComments();
  }

  render() {  

    if(this.state.isLoading){
      return (
        <Dialog visible={true}>
          <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <ActivityIndicator/>
            <View>
              <Text>Sedang memuat data</Text>
              <Caption>Harap tunggu...</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }
    const window = Dimensions.get("window");
    let creationDate = "";  
    let creationTime = "";

    if(this.state.discussion.creationTime){
       creationDate = moment(this.state.discussion.creationTime.seconds * 1000).format("DD MMMM YYYY");
       creationTime = moment(this.state.discussion.creationTime.seconds * 1000).format("HH:mm");
    }
    let remainingImageCount = 0;
    if(this.state.discussion.images && this.state.discussion.images.length>4){
      remainingImageCount = this.state.discussion.images.length-4;
    }

    const isAllowNotification = this.checkNotifAllowed()
   
    return (  

      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
      
        <KeyboardAwareScrollView style={{flex:1}}>         

          <Card style={{ elevation: 1, marginTop: 8}}>
              <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
                <SquareAvatar size={40} uri={"https://picsum.photos/200/200/?random"}/>
                <View style={{ marginLeft: 16 }}>
                  <Text style={{ fontWeight: "700" }}>{this.state.posterName}</Text>
                  <Caption style={{ marginTop: 0 }}>{creationDate} | Jam {creationTime} WIB</Caption>
                </View>
              </View>
              <View style={{ paddingHorizontal: 16}}>
                <Text style={{ fontWeight: "700" }}>{this.state.discussion.title}</Text>
                <Paragraph>
                  {this.state.discussion.description} 
                </Paragraph>
              </View>
              <View style={{ paddingHorizontal: 4, marginTop: 8}}>
                {(this.state.discussion.location)? 
                  <TouchableOpacity style={{flexDirection:"row"}} >
                    <EvilIcons name="location" size={24} style={{ color: (this.state.discussion)?"#0EAD69":"#5E8864",padding: 8, }}/>
                    <Text style={{alignSelf:"center", color:"#0EAD69",marginRight: 8}}>{(this.state.discussion.location)?"Location attached.":""}</Text>
                  </TouchableOpacity>
                  : <View/>}
              </View>

              <TouchableOpacity onPress={() => {this.handlePicturePress(this.state.discussion.images)}} style={{marginTop: 8}}>
              { (this.state.discussion.images && this.state.discussion.images.length) > 0?(
                <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 8 }}>
                    {this.state.discussion.images.map((item, index) => {
                      if((index >= 0 && index < 3)) {
                        return (
                          <View key={index} style={{ alignSelf: "stretch", flex: 1, height: (window.width/4), padding:4 }}>
                            <FastImage 
                              resizeMode="cover"
                              source={{ uri: item.downloadUrl  }} 
                              style={{ alignSelf: "stretch", flex: 1, borderRadius: 8 }}/>
                          </View>
                        )
                      }else if(index === 3) return (
                        <View key={index} style={{ alignSelf: "stretch", flex: 1, height: (window.width/4), padding:4 }}>
                          <FastImage source={{ uri: item.downloadUrl }} style={{ alignSelf: "stretch", flex: 1, borderRadius: 8 }} resizeMode="cover"/>
                          {(remainingImageCount>0)? 
                            <View style={{ borderRadius: 8,margin:4, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, .7)", alignItems: "center", justifyContent: "center" }}>
                              <Text style={{ color: "white" }}>+ {remainingImageCount}</Text>
                            </View>
                            :<View/>}
                        </View>
                      );
                    })}
                </View>

              ):<View/>}
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4 }}/>
                <Caption>Komentar</Caption>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleSharePress} style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="share" size={16} style={{ marginRight: 4 }}/>
                <Caption>Bagikan</Caption>
              </TouchableOpacity>
                {(isAllowNotification)? 
                  <TouchableOpacity onPress={this.handleNotifPress} style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="bell-off" size={16} style={{ marginRight: 4 }}/>
                    <Caption>Matikan</Caption>
                  </TouchableOpacity>
                  : 
                  <TouchableOpacity onPress={this.handleNotifPress} style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="bell" size={16} style={{ marginRight: 4 }}/>
                    <Caption>Aktifkan</Caption>
                  </TouchableOpacity>
                  }
             
            </View>
          </Card>
            <Card style={{marginHorizontal: 8,marginTop:8, padding:8}}>
              <View style={{flexDirection:"row", alignItems:"center"}}>
                <SquareAvatar size={30} uri={"https://picsum.photos/200/200/?random"}/>
                <TextInput
                  style={{ flex:1, marginBottom: 0, marginLeft:8 }}
                  onChangeText={this.handleCommentChange}
                  value={this.state.comment}
                  multiline={true}
                  placeholder="Tuliskan komentar kamu di sini."
                />         
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text>0/500</Text>
              </View>

               <FlatList
                  horizontal={true}
                  style={{ backgroundColor: "white" }}
                  data={this.state.imagesPicked}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    return (
                      <ImagePickerListItem 
                        onPress={() => this.handleDeleteImagePress(item)}
                        image={item}/>
                    )
                  }}
                />
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop:8}}>
                <TouchableOpacity onPress={this.handleMultipleImagePress}>
                  <EvilIcons name="image" size={32} style={{ color: "#5E8864",padding:8 }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleCameraPress}>
                  <EvilIcons name="camera" size={32} style={{ color: "#5E8864",padding:8 }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleLocationPress} style={{flexDirection:"row"}} >
                  <EvilIcons name="location" size={32} style={{ color: (this.state.locationCoordinate)?"#0EAD69":"#5E8864",padding: 8, }}/>
                  <Text style={{alignSelf:"center", color:"#0EAD69",marginRight: 8}}>{(this.state.locationCoordinate)?"Location attached.":""}</Text>
                </TouchableOpacity>
                
                <Button
                  onPress={this.handleSendCommentPress}
                  isLoading={this.state.isSendingComment}
                  style={{paddingVertical:8,paddingLeft:8,paddingRight:8,marginBottom:0}}
                  text={"Bagikan"}
                />
              </View>
            </Card>
          <Card style={{marginTop: 8}}>
            <FlatList
              data={this.state.commentList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <CommentListItem 
                   comment={item} onImagePress={()=>{this.handlePicturePress(item.images)}} 
                   />
                )
              }}
            />
          </Card>
        </KeyboardAwareScrollView>
        <DeleteDialog 
          ref ={i => this.deleteDialog = i}
          title= {"Apakah anda ingin menghapus gambar ini?"}
          onDeletePress={this.onDeletePress}/>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: { 
    borderTopColor: "#E8EEE8", 
    borderTopWidth: 1, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingHorizontal: 40,
    paddingVertical: 8
  },
  subjectContainer:{
    marginTop: 8,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 16
  },
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
export default withCurrentUser(DiscussionCommentScreen)
