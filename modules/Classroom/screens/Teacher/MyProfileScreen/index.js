import React from "react";
import { View, StyleSheet, PermissionsAndroid } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import TeacherAPI from "modules/Classroom/api/teacher";
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

const INITIAL_STATE = { 
  isLoadingProfile: true, 
  teacher: null, 
  status:"", 
  totalClass: 0,
  profilePicture: "https://picsum.photos/200/200/?random" 
}

/**
 * Parameter list
 * 
 * @param {string} teacherEmail
 */
export default class MyProfileScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Profil Guru"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };
  
  loadPeopleInformation = async () => {
    this.setState({ isLoadingProfile: true });

    const teacher = await TeacherAPI.getDetail(this.schoolId, this.teacherEmail);
    if(teacher.gender){
      teacher.gender = teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1)
    }

    const totalClass = (await ClassAPI.getUserActiveClasses(this.schoolId, this.teacherEmail)).length;
    if(teacher.profilePicture){
      this.setState({ profilePicture: teacher.profilePicture.downloadUrl });
    }
    this.setState({ isLoadingProfile: false, teacher, totalClass });
   
  }

  
  loadStatus = async () => {
    const status = await StatusAPI().getLatestStatus(this.props.currentUser.email);
    if(!status) status = { content: "Tulis statusmu disini..." };
    this.setState({ status: status.content });
  }

  handleArchivePress = () => {
    payload = {
      schoolId: this.schoolId,
      teacherEmail: this.teacherEmail
    }

    this.props.navigation.navigate("ArchiveSelectClass", payload)
  }
  
  handleStatusPress = () => {
    const payload = {
      schoolId: this.schoolId,
      onRefresh: this.loadStatus
    }
    this.props.navigation.navigate("StatusChange",payload)
  }

  handleClassListPress = e => {
    payload = {
      schoolId: this.schoolId,
      teacherEmail: this.teacherEmail
    }
    this.props.navigation.navigate("MyClass", payload);
  }

  
  changeProfilePicture = async () => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await this.requestStoragePermission()
      return
    }
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const storagePath = "/modules/classroom/teachers/"+uuid()
      const downloadUrl = await StorageAPI.uploadFile(storagePath, res.uri)
      await TeacherAPI.updateProfilePicture(this.schoolId, this.teacherEmail ,storagePath, downloadUrl)
    
      this.setState({profilePicture: downloadUrl})
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
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

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.teacherEmail = this.props.navigation.getParam("teacherEmail", "");
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.handleStatusPress = this.handleStatusPress.bind(this);
    this.handleArchivePress = this.handleArchivePress.bind(this);
    this.handleClassListPress = this.handleClassListPress.bind(this);
    this.loadStatus = this.loadStatus.bind(this);

  }

  componentDidMount(){ 
    this.loadPeopleInformation();
    this.loadStatus();
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
        <ScrollView>
          <TouchableOpacity onPress={() => {this.changeProfilePicture()}}>

            <PeopleProfileHeader
              profilePicture={this.state.profilePicture}
              nickName={this.state.teacher.name}
              status= {"NIK" + this.state.teacher.nik}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.handleStatusPress}>
            <View style={ styles.statusContainer }>
              <View>
                  <Text style={styles.label}>Status saya</Text>
                  <Text>{this.state.status}</Text>
              </View>
              <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
            </View>
          </TouchableOpacity>

          <View style={{  marginBottom: 16 }}>  
           <PeopleInformationContainer
              fieldName="Bergabung Sejak"
              fieldValue={moment(this.state.teacher.creationTime.seconds * 1000).format("DD MMMM YYYY")}/>
          </View>
          
          <View style={{  marginBottom: 16 }}>
            
            <PeopleInformationContainer
              fieldName="Alamat"
              fieldValue={this.state.teacher.address}/>
            <PeopleInformationContainer
              fieldName="Nomor Telepon"
              fieldValue={this.state.teacher.phone}/>
            <PeopleInformationContainer
              fieldName="Email"
              fieldValue={this.state.teacher.id}/>
            <PeopleInformationContainer
              fieldName="Jenis Kelamin"
              fieldValue={this.state.teacher.gender}/>
          
          </View>
          <View style={{  marginBottom: 16 }}>
            <TouchableOpacity onPress={this.handleClassListPress}>
            <View style={[styles.listItemContainer, {paddingVertical: 16}]}>
                <View style={styles.listDescriptionContainer}>
                  <Text style={styles.label}>Jumlah Kelas</Text>
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
                  <Text style={styles.label}>Arsip Tugas</Text>
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