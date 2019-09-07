import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Title, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import ClassAPI from "modules/Classroom/api/class";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment"
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import StatusAPI from "src/api/status";
import Button from "src/components/Button";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";

const INITIAL_STATE = { isLoadingProfile: true, student: {}, status: "", totalClass:0  }


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
    if(this._isMounted)
     this.setState({ isLoadingProfile: true });

    const student = await StudentAPI.getDetail(this.props.currentSchool.id, this.studentEmail);
    if(student.gender){
      student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
    }
    const totalClass = (await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.studentEmail)).length;

    if(this._isMounted)
      this.setState({ isLoadingProfile: false, student, totalClass });

  }

  loadStatus = async () => {
    let status = await StatusAPI.getLatestStatus(this.studentEmail);
    if(!status) status = { content: "-" };
    if(this._isMounted)
      this.setState({ status: status.content });
  }

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.studentEmail = this.props.navigation.getParam("studentEmail", null);
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    
  }

  componentDidMount(){ 
    this._isMounted = true
    this.loadPeopleInformation(); 
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
      <View style={{ backgroundColor: "#E8EEE8"}}>
        <ScrollView>
          <View style={{marginTop: 16}}/>
          <PeopleProfileHeader
            style={{padding:16}}
            profilePicture="https://picsum.photos/200/200/?random"
            title={this.state.student.name}
            subtitle= {"NIM " + ((!this.state.student)?this.state.student.noInduk:"-")}/>


          <View style={{ marginTop:16, paddingHorizontal: 16, paddingVertical:8, backgroundColor: "#fff" }}>
            <Text style={{fontWeight: "bold"}}>Status</Text>
            <View style={{flexDirection:"row"}}>
            <Text>{this.state.status}</Text>
            </View>
          </View>

          
          <View style={{  marginVertical: 16 }}>
             <PeopleInformationContainer
              fieldName="Bergabung Sejak"
              fieldValue={moment(this.state.student.creationTime.seconds * 1000).format("DD MMMM YYYY")}/>
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
              fieldValue={this.state.totalClass}/>
          </View>
          <Button text="Mulai Percakapan" style={{margin: 16}}></Button>
        </ScrollView>
      </View>
    )
  }
}
export default withCurrentTeacher(StudentProfileScreen)
