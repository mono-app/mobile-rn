import React from "react";
import { View, StyleSheet, PermissionsAndroid } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import ClassAPI from "modules/Classroom/api/class";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import PeopleAPI from "src/api/people";
import moment from "moment"
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import uuid from "uuid/v4"
import DocumentPicker from 'react-native-document-picker';
import StorageAPI from "src/api/storage";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";

const INITIAL_STATE = { isLoadingProfile: true, 
  student: {}, 
  status:"", 
  studentEmail:"", 
  totalActiveClass: 0, 
  totalArchiveClass: 0,
  profilePicture: "https://picsum.photos/200/200/?random"
}


class MyProfileScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Profil Saya"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };
  
  loadPeopleInformation = async () => {
    this.setState({ isLoadingProfile: true });

    const student = await StudentAPI.getDetail(this.props.currentSchool.id, this.props.currentStudent.email);
    if(student.gender){
      student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
    }
    const totalActiveClass = (await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.props.currentStudent.email)).length;
    const totalArchiveClass = (await ClassAPI.getUserArchiveClasses(this.props.currentSchool.id, this.props.currentStudent.email)).length;
    if(student.profilePicture){
      this.setState({ profilePicture: student.profilePicture.downloadUrl });
    }
    this.setState({ isLoadingProfile: false, student, totalActiveClass, totalArchiveClass });
   
  }
  
  loadStatus = async () => {
    const status = await StatusAPI().getLatestStatus(this.props.currentUser.email);
    if(!status) status = { content: "Tulis statusmu disini..." };
    this.setState({ status: status.content });
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
      const storagePath = "/modules/classroom/students/"+uuid()
      const downloadUrl = await StorageAPI.uploadFile(storagePath, res.uri)
      await StudentAPI.updateProfilePicture(this.props.currentSchool.id, this.props.currentStudent.email ,storagePath, downloadUrl)

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
  
  handleStatusPress = () => {
    const payload = {
      onRefresh: this.loadStatus
    }
    this.props.navigation.navigate("StatusChange",payload)
  }

  
  handleMyClassPress = () => {
    payload = {
      schoolId: this.props.currentSchool.id,
      studentEmail: this.props.currentStudent.email
    }
    this.props.navigation.navigate("MyClass", payload);
  }

  handleMyArchiveClassPress = () => {
    payload = {
      schoolId: this.props.currentSchool.id,
      studentEmail: this.props.currentStudent.email
    }
    this.props.navigation.navigate("MyArchiveClass", payload);
  }

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.loadStatus = this.loadStatus.bind(this);
    this.handleMyClassPress = this.handleMyClassPress.bind(this);
    this.handleMyArchiveClassPress = this.handleMyArchiveClassPress.bind(this);
    this.changeProfilePicture = this.changeProfilePicture.bind(this);
    this.requestStoragePermission = this.requestStoragePermission.bind(this);

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
              nickName={this.state.student.name}
              status= {(this.state.student.noInduk) ?"NIM " +  this.state.student.noInduk: "NIM " + "-"}/>
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
              fieldValue={(this.state.student.creationTime)?moment(this.state.student.creationTime.seconds * 1000).format("DD MMMM YYYY"): ""}/>
          </View>
          
          <View style={{  marginBottom: 16 }}>
            
            <PeopleInformationContainer
              fieldName="Alamat"
              fieldValue={this.state.student.address}/>
            <PeopleInformationContainer
              fieldName="Nomor Telepon"
              fieldValue={this.state.student.phone}/>
            <PeopleInformationContainer
              fieldName="Email"
              fieldValue={this.state.student.id}/>
            <PeopleInformationContainer
              fieldName="Jenis Kelamin"
              fieldValue={this.state.student.gender}/>
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

export default withCurrentStudent(MyProfileScreen)
