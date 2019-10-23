import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import TeacherAPI from "modules/Classroom/api/teacher";
import Permissions from "react-native-permissions";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import StatusAPI from "src/api/status";
import ClassAPI from "modules/Classroom/api/class";
import moment from "moment"
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import uuid from "uuid/v4"
import DocumentPicker from 'react-native-document-picker';
import StorageAPI from "src/api/storage";
import { withCurrentUser } from "src/api/people/CurrentUser"
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import ImageCompress from "src/api/ImageCompress"
import { withTutorialClassroom } from "modules/Classroom/api/TutorialClassroom";
import Key from "src/helper/key"
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { 
  isLoadingProfile: true, 
  status:"", 
  totalClass: 0,
  profilePicture: "https://picsum.photos/200/200/?random",
  isUploadingImage: false
}

class MyProfileScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };
  
  loadTotalClass = async () => {
    if(this._isMounted)
      this.setState({ isLoadingProfile: true });

    const totalClass = (await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.props.currentTeacher.email)).length;
   
    if(this._isMounted)
     this.setState({ isLoadingProfile: false, totalClass });
  }

  
  loadStatus = async () => {
    let status = await StatusAPI.getLatestStatus(this.props.currentUser.email);
    if(!status) status = { content: this.props.t("writeStatusHere") };
    if(this._isMounted)
      this.setState({ status: status.content });
  }

  handleArchivePress = () => {
    this.props.navigation.navigate("ArchiveSelectClass")
  }
  
  handleStatusPress = () => {
    const payload = {
      onRefresh: this.loadStatus
    }
    this.props.navigation.navigate("StatusChange",payload)
  }

  handleClassListPress = e => {
   
    this.props.navigation.navigate("MyClass");
  }

  
  handleProfilePicturePress = async () => {
    const isPermissionGranted = await this.checkPermission();
    if(!isPermissionGranted){
      await this.requestStoragePermission();
      return;
    }
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      this.setState({isUploadingImage: true})

      const storagePath = "/modules/classroom/teachers/"+uuid()
      const compressedRes = await ImageCompress.compress(res.uri, res.size)

      const downloadUrl = await StorageAPI.uploadFile(storagePath, compressedRes.uri)
      await TeacherAPI.updateProfilePicture(this.props.currentSchool.id, this.props.currentTeacher.email ,storagePath, downloadUrl)
          
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
    this.setState({isUploadingImage: false})
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

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.loadTotalClass = this.loadTotalClass.bind(this);
    this.handleStatusPress = this.handleStatusPress.bind(this);
    this.handleArchivePress = this.handleArchivePress.bind(this);
    this.handleClassListPress = this.handleClassListPress.bind(this);
    this.checkPermission = this.checkPermission.bind(this)
    this.loadStatus = this.loadStatus.bind(this);
    this.handleProfilePicturePress = this.handleProfilePicturePress.bind(this);
    
  }

  componentDidMount(){ 
    this._isMounted = true
    this.loadTotalClass();
    this.loadStatus();
    this.props.classroomTutorial.show(Key.KEY_TUTORIAL_CLASSROOM_CHANGE_PROFILE_PIC)
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render(){
    if(this.state.isLoadingProfile){
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
    }else return (
      <View style={{ backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.t("teacherProfile")}
            style={{ backgroundColor: "white" }}
          />
        <ScrollView style={{ marginBottom: 56 }}>
            <PeopleProfileHeader
              onProfilePicturePress={this.handleProfilePicturePress}
              style={{padding:16}}
              isLoading={this.state.isUploadingImage}
              showTutorialChangeProfilePic = {this.props.showTutorialChangeProfilePic}
              tutorial = {this.props.classroomTutorial}
              profilePicture={(this.props.currentTeacher.profilePicture)? this.props.currentTeacher.profilePicture.downloadUrl : this.state.profilePicture }
              title={this.props.currentTeacher.name}
              subtitle= {"NIK: " + this.props.currentTeacher.nik}/>
          <TouchableOpacity onPress={this.handleStatusPress}>
            <View style={ styles.statusContainer }>
              <View>
                  <Text style={styles.label}>{this.props.t("myStatus")}</Text>
                  <Text numberOfLines={2}>{this.state.status}</Text>
              </View>
              <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
            </View>
          </TouchableOpacity>

          <View style={{  marginBottom: 16 }}>  
           <PeopleInformationContainer
              fieldName={this.props.t("joinDate")}
              fieldValue={moment(this.props.currentTeacher.creationTime.seconds * 1000).format("DD MMMM YYYY")}/>
          </View>
          
          <View style={{  marginBottom: 16 }}>
            
            <PeopleInformationContainer
              fieldName={this.props.t("address")}
              fieldValue={this.props.currentTeacher.address}/>
            <PeopleInformationContainer
              fieldName={this.props.t("phoneNo")}
              fieldValue={this.props.currentTeacher.phone}/>
            <PeopleInformationContainer
              fieldName="Email"
              fieldValue={this.props.currentTeacher.email}/>
            <PeopleInformationContainer
              fieldName={this.props.t("gender")}
              fieldValue={this.props.currentTeacher.gender}/>
          
          </View>
          <View style={{  marginBottom: 16 }}>
            <TouchableOpacity onPress={this.handleClassListPress}>
            <View style={[styles.listItemContainer, {paddingVertical: 16}]}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>{this.props.t("totalClass")}</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.totalClass}</Text>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleArchivePress}>
              <View style={[styles.listItemContainer, {paddingVertical: 16}]}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>{this.props.t("taskArchive")}</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: "center"
  },
  statusContainer: {
    marginVertical: 16,
    padding: 16,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInputContainer: {
    flex: 1,
    height: 30,
    justifyContent:"center"
  },
  label: {
    fontWeight: "bold"
  }
})
export default withTranslation()(withCurrentUser(withTutorialClassroom(withCurrentTeacher(MyProfileScreen))))
