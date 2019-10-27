import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { ActivityIndicator, Caption, Dialog, Text} from "react-native-paper";
import Permissions from "react-native-permissions";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import SquareAvatar from "src/components/Avatar/Square";
import Header from "modules/Classroom/components/Header";
import SchoolAPI from "modules/Classroom/api/school"
import StorageAPI from "src/api/storage";
import uuid from "uuid/v4"
import DocumentPicker from 'react-native-document-picker';
import { withCurrentUser } from "src/api/people/CurrentUser"
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";
import ImageCompress from "src/api/ImageCompress"
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = {
  isLoading: false,
  profilePicture: "https://picsum.photos/200/200/?random",
  schoolId: "",
  school: {},
  userName: ""
};

class SchoolAdminHomeScreen extends React.PureComponent {
  static navigationOptions = () => {
    return { header: null };
  };

  handleAddPress = e => {
    this.props.navigation.navigate("SchoolAdminAdd");
  };

  handleDataMasterPress = e => {
    this.props.navigation.navigate("SchoolAdminDataMaster");
  };

  handleArchiveClass = e => {
    this.props.navigation.navigate("ArchiveClassList");
  };
  
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

  changeSchoolProfilePicture = async () => {
    const isPermissionGranted = await this.checkPermission();
    if(!isPermissionGranted){
      await this.requestStoragePermission();
      return;
    }
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const storagePath = "/modules/classroom/schools/"+uuid()
      const compressedRes = await ImageCompress.compress(res.uri, res.size)
      const downloadUrl = await StorageAPI.uploadFile(storagePath, compressedRes.uri)
      await SchoolAPI.updateSchoolProfilePicture(this.state.schoolId, storagePath, downloadUrl)

      this.setState({profilePicture: downloadUrl})
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
   
  }

  constructor(props) {
    super(props);
    INITIAL_STATE.schoolId = SchoolAPI.currentSchoolId
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.handleAddPress = this.handleAddPress.bind(this);
    this.handleDataMasterPress = this.handleDataMasterPress.bind(this);
    this.handleArchiveClass = this.handleArchiveClass.bind(this);
    this.changeSchoolProfilePicture = this.changeSchoolProfilePicture.bind(this);
    this.requestStoragePermission = this.requestStoragePermission.bind(this);
    this.checkPermission = this.checkPermission.bind(this);
  }

  async componentDidMount(){
    this._isMounted=true
    if(this._isMounted){
      this.setState({isLoading: true})
    }
    await this.props.setCurrentSchoolAdminId(this.state.schoolId, this.props.currentUser.id)
    if(this._isMounted){
      this.setState({isLoading: false})
    }
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
    return (
      <View style={styles.groupContainer}>
        <Header navigation={this.props.navigation} title={this.props.currentSchool.name} />

        <View style={styles.logo}>
          <SquareAvatar size={100} uri={ this.props.schoolProfilePicture }/>
          <TouchableOpacity onPress={this.changeSchoolProfilePicture}>
            <Text style={{ fontWeight: "400", fontSize: 16, marginTop: 8, color:"#0ead69" }}>{this.props.t("changeSchoolPic")}</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "700", marginTop: 16, fontSize: 20 }}>
            {this.props.t("welcomeComa")}
          </Text>
          <Text style={{ fontWeight: "400", fontSize: 16 }}>{this.props.currentSchoolAdmin.name}</Text>
        </View>

        <View style={{marginBottom: 64}}/>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.handleAddPress} >
            <View style={styles.button} >
              <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="plus" style={{color: "#fff"}} size={24} />
              </View>
            </View>
            <Text style={{textAlign:"center"}}>{this.props.t("add")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleDataMasterPress}>
            <View style={styles.button} >
              <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="cog" style={{color: "#fff"}} size={24} />
              </View>
            </View>
            <Text style={{textAlign:"center"}}>{this.props.t("dataMaster")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleArchiveClass}>
            <View style={styles.button} >
              <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="folder" style={{color: "#fff"}} size={24} />
              </View>
            </View>
            <Text style={{textAlign:"center"}}>{this.props.t("classArchive")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  logo: {
    marginTop: 36,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  groupContainer: {  flex: 1, backgroundColor: "#E8EEE8"},
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  menu: {
    padding: 16,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#0EAD69",
    height: 60,
    width: 60,
    borderColor: "#fff",
    borderRadius: 12
  }
});
export default withTranslation()(withCurrentUser(withCurrentSchoolAdmin(SchoolAdminHomeScreen)))