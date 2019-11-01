import React from "react";
import { Dimensions, View, FlatList, StyleSheet, Platform, Linking } from "react-native";
import { ActivityIndicator, Dialog, Text, Card, Caption, Paragraph, Snackbar } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import DiscussionAPI from "modules/Classroom/api/discussion";
import {  TouchableOpacity } from "react-native-gesture-handler";
import CircleAvatar from "src/components/Avatar/Circle";
import moment from "moment";
import Permissions from "react-native-permissions";
import TextInput from "src/components/TextInput";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import Button from "src/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import StudentAPI from "modules/Classroom/api/student";
import DiscussionCommentListItem from "modules/Classroom/components/DiscussionCommentListItem";
import DeleteDialog from "src/components/DeleteDialog";
import ImageListItem from "src/components/ImageListItem"
import DocumentPicker from 'react-native-document-picker';
import uuid from "uuid/v4"
import { withCurrentUser } from "src/api/people/CurrentUser"
import ImagePicker from 'react-native-image-picker';
import ImageCompress from "src/api/ImageCompress"
import { withTranslation } from 'react-i18next';
import HelperAPI from "src/api/helper";

const INITIAL_STATE = { 
  isLoading: true, 
  isSendingComment: false,
  discussion: {}, 
  totalParticipant: 0 ,
  comment:"", 
  commentList: [],
  imagesPicked: [],
  selectedImageToDelete: {},
  showDeleteImageDialog: false,
  locationCoordinate: null,
  showShareSuccessSnackbar: false
};
class DiscussionCommentScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header:null
    };
  };
  loadDiscussion = async () => {
    if(this._isMounted)
      this.setState({ isLoading: true });
    const student = await StudentAPI.getDetail(this.schoolId, this.discussion.posterId)
    const currentUserId = this.props.currentUser.id
    const currentStudent = await StudentAPI.getDetail(this.schoolId, currentUserId)
    const totalParticipant = await DiscussionAPI.getTotalParticipant(this.schoolId, this.classId, this.taskId, this.discussion.id);
    if(this._isMounted)
      this.setState({ isLoading: false, discussion: this.discussion,totalParticipant, posterName: student.name, dicussionNotification: currentStudent.dicussionNotification });
  }

  loadComments = async () => {
    if(this._isMounted)
      this.setState({ commentList: [] })
    const commentList = await DiscussionAPI.getComments(this.schoolId, this.classId, this.taskId, this.discussion.id);
    if(this._isMounted)
      this.setState({ commentList })
  }

  handleCommentChange = comment => {
    if(this._isMounted)
      this.setState({ comment })
  }
  
  checkPermission = async () => {
    let permissionResponse;
    if(Platform.OS === "android"){
      permissionResponse = await Permissions.check("storage");
    }else if(Platform.OS === "ios"){
      permissionResponse = await Permissions.check("photo");
    }

    if(permissionResponse === "authorized") return true;
    else return false;
  }
  
  requestStoragePermission = async () => {
    try{
      let permissionResponse;
      if(Platform.OS === "android"){
        permissionResponse = await Permissions.request("storage");
      }else if(Platform.OS === "ios"){
        permissionResponse = await Permissions.request("photo");
      }

      if(permissionResponse === "authorized"){
        // do something if authorized
      }else{
        // do something if unauthorized
      }
    }catch(err){

    }
  }

  handleSendCommentPress = async () => {
    const comment = JSON.parse(JSON.stringify(this.state.comment)).trim()
    if(comment.length>0){
      if(this._isMounted) this.setState({ isSendingComment:true })
      const currentUserId = this.props.currentUser.id

      data = {
        comment: this.state.comment,
        posterId: currentUserId,
        location: {...this.state.locationCoordinate},
        images: this.state.imagesPicked
      }

      await DiscussionAPI.sendComment(this.schoolId, this.classId, this.taskId, this.discussion.id, data)
      await this.loadComments();
      if(this._isMounted) this.setState({ comment:"", isSendingComment:false, locationCoordinate: null, imagesPicked: [] })
    }
  }

  handlePicturePress = (images,index) => {
    payload = {
      index,
      images: images
    }
    this.props.navigation.navigate("GallerySwiper", payload);
  }

  handleLocationPress = () => {
    const payload = {
      latitude: (this.state.locationCoordinate)?this.state.locationCoordinate.latitude:"",
      longitude: (this.state.locationCoordinate)?this.state.locationCoordinate.longitude:"",
      onRefresh:(locationCoordinate)=> {
        if(this._isMounted)
          this.setState({locationCoordinate})
        }
    }
    this.props.navigation.navigate("MapsPicker",payload)
  }

  handleCameraPress = async () => {
    const isPermissionGranted = await this.checkPermission();
    if(!isPermissionGranted){
      await this.requestStoragePermission();
      return;
    }
   
    const options = {
      mediaType: 'photo',
    };
    ImagePicker.launchCamera(options, async (response) => {
      if(response.uri){
        const compressedRes = await ImageCompress.compress(response.uri, response.fileSize)

        let clonedImagesPicked = JSON.parse(JSON.stringify(this.state.imagesPicked))
        clonedImagesPicked.push({id: uuid(), ...compressedRes})
        if(this._isMounted)
          this.setState({imagesPicked: clonedImagesPicked})
      }
    });
  }

  handleMultipleImagePress = async () => {
    const isPermissionGranted = await this.checkPermission();
    if(!isPermissionGranted){
      await this.requestStoragePermission();
      return;
    }
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      let clonedImagesPicked = JSON.parse(JSON.stringify(this.state.imagesPicked))
      for (const res of results) {
        const compressedRes = await ImageCompress.compress(res.uri, res.size)
        clonedImagesPicked.push({id: uuid(), ...compressedRes})
      }
      if(this._isMounted)
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
    if(this._isMounted)
      this.setState({selectedImageToDelete: item})
    this.deleteDialog.toggleShow()
  }

  onDeletePress = () => {
    const newselectedImageToDelete = this.state.imagesPicked.filter((image) => {
      return image.id!= this.state.selectedImageToDelete.id
    })
    if(this._isMounted){
      this.setState({imagesPicked: []})
      this.setState({imagesPicked: newselectedImageToDelete})
    }
   
    this.deleteDialog.toggleShow()
  }  

  showShareDialogSuccess = () => {
    if(this._isMounted)
      this.setState({showShareSuccessSnackbar: true})
  }

  handleSharePress = () => {
    const payload = {
      schoolId: this.schoolId,
      classId: this.classId,
      taskId: this.taskId,
      discussion: this.state.discussion,
      onComplete: this.showShareDialogSuccess
    }
    this.props.navigation.navigate("ShareDiscussion", payload)
  }

  handleNotifPress = async () => {
    const isAllowNotification = this.checkNotifAllowed()

    if(isAllowNotification){
      await StudentAPI.updateDiscussionNotification(this.props.currentUser.id,this.discussion.id, false);
    }else{
      await StudentAPI.updateDiscussionNotification(this.props.currentUser.id,this.discussion.id, true);
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

  handleLocationAttachedPress = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${this.state.discussion.location.latitude},${this.state.discussion.location.longitude}`;
    const label = 'Location Attached';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url); 
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.discussion = this.props.navigation.getParam("discussion", "");
    this.isFromNotification = this.props.navigation.getParam("isFromNotification", false)
    this.loadDiscussion = this.loadDiscussion.bind(this);
    this.loadComments = this.loadComments.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSendCommentPress = this.handleSendCommentPress.bind(this);
    this.checkNotifAllowed = this.checkNotifAllowed.bind(this);
    this.handlePicturePress = this.handlePicturePress.bind(this);
    this.handleLocationPress = this.handleLocationPress.bind(this);
    this.handleMultipleImagePress = this.handleMultipleImagePress.bind(this);
    this.checkPermission = this.checkPermission.bind(this)
    this.handleDeleteImagePress = this.handleDeleteImagePress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.handleCameraPress = this.handleCameraPress.bind(this);
    this.requestStoragePermission = this.requestStoragePermission.bind(this);
    this.handleSharePress = this.handleSharePress.bind(this);
    this.handleLocationAttachedPress = this.handleLocationAttachedPress.bind(this);
    this.showShareDialogSuccess = this.showShareDialogSuccess.bind(this);
    this.deleteDialog = null
  }

  componentDidMount(){
    this._isMounted = true;
    this.loadDiscussion();
    this.loadComments();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {  

    if(this.state.isLoading){
      return (
        <Dialog visible={true}>
          <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <ActivityIndicator/>
            <View>
              <Text>{this.props.t("loadData")}</Text>
              <Caption>{this.props.t("pleaseWait")}</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }
    let creationDate = "";  
    let creationTime = "";

    if(this.state.discussion.creationTime){
       creationDate = moment(this.state.discussion.creationTime.seconds * 1000).format("DD MMMM YYYY");
       creationTime = moment(this.state.discussion.creationTime.seconds * 1000).format("HH:mm");
    }

    const isAllowNotification = this.checkNotifAllowed()

    return (  

      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.navigation.getParam("discussion", "").title}
            subtitle={this.state.totalParticipant+" partisipan"}
            style={{ backgroundColor: "#fff" }}
        />
       
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{flex:1}}>         
          <Card style={{ elevation: 1, marginTop: 8}}>
              <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
                <CircleAvatar size={40} uri={HelperAPI.getDefaultProfilePic()}/>
                <View style={{ marginLeft: 16 }}>
                  <Text style={{ fontWeight: "700" }}>{this.state.posterName}</Text>
                  <Caption style={{ marginTop: 0 }}>{creationDate} | {this.props.t("time2")} {creationTime} WIB</Caption>
                </View>
              </View>
              <View style={{ paddingHorizontal: 16}}>
                <Text style={{ fontWeight: "700" }}>{this.state.discussion.title}</Text>
                <Paragraph>
                  {this.state.discussion.description} 
                </Paragraph>
              </View>
              <View style={{ paddingHorizontal: 4, marginTop: 8}}>
                {(this.state.discussion.location&&this.state.discussion.location.latitude)? 
                  <TouchableOpacity style={{flexDirection:"row"}} onPress={this.handleLocationAttachedPress} >
                    <EvilIcons name="location" size={24} style={{ color: (this.state.discussion)?"#0EAD69":"#5E8864",padding: 8, }}/>
                    <Text style={{alignSelf:"center", color:"#0EAD69",marginRight: 8}}>Location attached.</Text>
                  </TouchableOpacity>
                  : <View/>}
              </View>
              <View style={{marginTop: 8}}>
                <FlatList
                    horizontal={true}
                    style={{ backgroundColor: "white" }}
                    data={this.state.discussion.images}
                    keyExtractor={(item) => item.storagePath}
                    renderItem={({ item, index }) => {
                      return (
                        <ImageListItem 
                          onPress={() => {this.handlePicturePress(this.state.discussion.images,index)}}
                          image={item}/>
                      )
                    }}
                  />
             </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4 }}/>
                <Caption>{this.props.t("comments")}</Caption>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleSharePress} style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="share" size={16} style={{ marginRight: 4 }}/>
                <Caption>{this.props.t("share")}</Caption>
              </TouchableOpacity>
                {(isAllowNotification)? 
                  <TouchableOpacity onPress={this.handleNotifPress} style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="bell-off" size={16} style={{ marginRight: 4 }}/>
                    <Caption>{this.props.t("turnOff")}</Caption>
                  </TouchableOpacity>
                  : 
                  <TouchableOpacity onPress={this.handleNotifPress} style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="bell" size={16} style={{ marginRight: 4 }}/>
                    <Caption>{this.props.t("turnOn")}</Caption>
                  </TouchableOpacity>
                  }
             
            </View>
          </Card>
            <Card style={{marginHorizontal: 8,marginTop:8, padding:8}}>
              <View style={{flexDirection:"row", alignItems:"center"}}>
                <CircleAvatar size={30} uri={HelperAPI.getDefaultProfilePic()}/>
                <TextInput
                  style={{ flex:1, marginBottom: 0, marginLeft:8 }}
                  onChangeText={this.handleCommentChange}
                  value={this.state.comment}
                  multiline={true}
                  maxLength={500}
                  placeholder="Tuliskan komentar kamu di sini."
                />         
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text>{this.state.comment.length}/500</Text>
              </View>

               <FlatList
                  horizontal={true}
                  style={{ backgroundColor: "white" }}
                  data={this.state.imagesPicked}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    return (
                      <ImageListItem 
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
                  disabled={this.state.isSendingComment}
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
                  <DiscussionCommentListItem 
                    schoolId={this.schoolId} comment={item} onImagePress={(idx)=>{this.handlePicturePress(item.images, idx)}} 
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
          <Snackbar
          visible= {this.state.showShareSuccessSnackbar}
          onDismiss={() => this.setState({ showShareSuccessSnackbar: false })}
          style={{backgroundColor:"#0ead69"}}
          duration={Snackbar.DURATION_SHORT}>
          Berhasil membagikan
        </Snackbar>
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
export default withTranslation()(withCurrentUser(DiscussionCommentScreen))
