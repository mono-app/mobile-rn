import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption, Platform } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import Permissions from "react-native-permissions";
import ClassAPI from "modules/Classroom/api/class";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import StatusAPI from "src/api/status";
import moment from "moment"
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import uuid from "uuid/v4"
import DocumentPicker from 'react-native-document-picker';
import StorageAPI from "src/api/storage";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";
import { withCurrentUser } from "src/api/people/CurrentUser";
import ImageCompress from "src/api/ImageCompress"

const INITIAL_STATE = { isLoadingProfile: true, 
  status:"", 
  totalActiveClass: 0, 
  totalArchiveClass: 0,
  profilePicture: "https://picsum.photos/200/200/?random"
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

    const totalActiveClass = (await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.props.currentStudent.email)).length;
    const totalArchiveClass = (await ClassAPI.getUserArchiveClasses(this.props.currentSchool.id, this.props.currentStudent.email)).length;
    if(this._isMounted)
      this.setState({ isLoadingProfile: false, totalActiveClass, totalArchiveClass });
   
  }
  
  loadStatus = async () => {
    let status = await StatusAPI.getLatestStatus(this.props.currentStudent.email);
    if(!status){
      status = { content: "Tulis statusmu disini..." };
    } 
    if(this._isMounted)
      this.setState({ status: status.content });
  }

  changeProfilePicture = async () => {
    const isPermissionGranted = await this.checkPermission();
    if(!isPermissionGranted){
      await this.requestStoragePermission();
      return;
    }
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const storagePath = "/modules/classroom/students/"+uuid()
      const compressedRes = await ImageCompress.compress(res.uri, res.size)

      const downloadUrl = await StorageAPI.uploadFile(storagePath, compressedRes.uri)
      await StudentAPI.updateProfilePicture(this.props.currentSchool.id, this.props.currentStudent.email ,storagePath, downloadUrl)
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
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
  
  handleStatusPress = () => {
    const payload = {
      onRefresh: this.loadStatus
    }
    this.props.navigation.navigate("StatusChange",payload)
  }

  
  handleMyClassPress = () => {
    this.props.navigation.navigate("MyClass");
  }

  handleMyArchiveClassPress = () => {
    this.props.navigation.navigate("MyArchiveClass");
  }

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.loadTotalClass = this.loadTotalClass.bind(this);
    this.loadStatus = this.loadStatus.bind(this);
    this.handleMyClassPress = this.handleMyClassPress.bind(this);
    this.handleMyArchiveClassPress = this.handleMyArchiveClassPress.bind(this);
    this.changeProfilePicture = this.changeProfilePicture.bind(this);
    this.checkPermission = this.checkPermission.bind(this)
    this.requestStoragePermission = this.requestStoragePermission.bind(this);
  }

  componentDidMount(){ 
    this._isMounted = true
    this.loadTotalClass();
    this.loadStatus();
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
              <Text>Sedang memuat data</Text>
              <Caption>Harap tunggu...</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }else return (
      <View style={{ backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title="Profil Saya"
            style={{ backgroundColor: "white" }}
          />
        <ScrollView style={{marginBottom:56}}>
          <TouchableOpacity onPress={() => {this.changeProfilePicture()}}>

          <PeopleProfileHeader
            style={{padding:16}}
            profilePicture={(this.props.currentStudent.profilePicture)? this.props.currentStudent.profilePicture.downloadUrl : this.state.profilePicture }
            title={this.props.currentStudent.name}
            subtitle={(this.props.currentStudent.noInduk) ?"NIM " +  this.props.currentStudent.noInduk: "NIM " + "-"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.handleStatusPress}>
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Status saya</Text>
              <View style={{flexDirection:"row"}}>
                <Text>{this.state.status}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={{  marginBottom: 16 }}>  
           <PeopleInformationContainer
              fieldName="Bergabung Sejak"
              fieldValue={(this.props.currentStudent.creationTime)?moment(this.props.currentStudent.creationTime.seconds * 1000).format("DD MMMM YYYY"): ""}/>
          </View>
          
          <View style={{  marginBottom: 16 }}>
            
            <PeopleInformationContainer
              fieldName="Alamat"
              fieldValue={this.props.currentStudent.address}/>
            <PeopleInformationContainer
              fieldName="Nomor Telepon"
              fieldValue={this.props.currentStudent.phone}/>
            <PeopleInformationContainer
              fieldName="Email"
              fieldValue={this.props.currentStudent.email}/>
            <PeopleInformationContainer
              fieldName="Jenis Kelamin"
              fieldValue={this.props.currentStudent.gender}/>
          </View>
          <View style={{  marginBottom: 16 }}>
            <TouchableOpacity onPress={this.handleMyClassPress}>
            <View style={[styles.listItemContainer, {paddingVertical: 16}]}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Jumlah Kelas</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.totalActiveClass}</Text>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleMyArchiveClassPress}>
              <View style={[styles.listItemContainer, {paddingVertical: 16}]}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Riwayat Kelas</Text>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.totalArchiveClass}</Text>
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
    backgroundColor: "white",
    padding: 16,
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

export default withCurrentUser(withCurrentStudent(MyProfileScreen))
