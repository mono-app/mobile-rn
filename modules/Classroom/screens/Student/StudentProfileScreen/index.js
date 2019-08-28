import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Title, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "../../../api/student";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment"
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import StatusAPI from "src/api/status";
import Button from "src/components/Button";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";

const INITIAL_STATE = { 
  isLoadingProfile: true, 
  student: {}, 
  status: "",
  profilePicture: "https://picsum.photos/200/200/?random"
}

class StudentProfileScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Profil Murid"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadPeopleInformation = async () => {
    this.setState({ isLoadingProfile: true });
    console.log(this.props.currentSchool.id, this.studentEmail)
    const student = await StudentAPI.getDetail(this.props.currentSchool.id, this.studentEmail);
    if(student.gender){
      student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
    }
    if(student.profilePicture){
      this.setState({ profilePicture: student.profilePicture.downloadUrl });
    }
    this.setState({ isLoadingProfile: false, student });
  }

  loadStatus = async () => {
    let status = await StatusAPI.getLatestStatus(this.studentEmail);
    if(!status) status = { content: "-" };
    this.setState({ status: status.content });
  }

  constructor(props){
    super(props);
    this.studentEmail = this.props.navigation.getParam("studentEmail", null);
    this.state = INITIAL_STATE;
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    
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
      <View style={{ backgroundColor: "#E8EEE8"}}>
        <ScrollView>
          <View style={{marginTop: 16}}/>
          <PeopleProfileHeader
            style={{padding:16}}
            profilePicture="https://picsum.photos/200/200/?random"
            title={this.state.student.name}
            subtitle= {"NIM: " + ((this.state.student.noInduk)?this.state.student.noInduk:"-")}/>

          <View style={{ marginTop:16, paddingHorizontal: 16, paddingVertical:8, backgroundColor: "#fff" }}>
            <Text style={{fontWeight: "bold"}}>Status</Text>
            <View style={{flexDirection:"row"}}>
            <Text>{this.state.status}</Text>
            </View>
          </View>

          
          <View style={{  marginVertical: 16 }}>
             <PeopleInformationContainer
              fieldName="Bergabung Sejak"
              fieldValue={(this.state.student.creationTime)? moment(this.state.student.creationTime.seconds * 1000).format("DD MMMM YYYY") : ""}/>
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
          <View>
            <PeopleInformationContainer
              fieldName="Jumlah Kelas"
              fieldValue="-"/>
          </View>
          <Button text="Mulai Percakapan" style={{margin: 16}}></Button>
        </ScrollView>
      </View>
    )
  }
}

export default withCurrentStudent(StudentProfileScreen)
