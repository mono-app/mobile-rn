import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Title, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import ClassAPI from "modules/Classroom/api/class";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment"
import ProfileHeader from "modules/Classroom/components/ProfileHeader";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import StatusAPI from "src/api/status";
import Button from "src/components/Button";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import { PersonalRoomsAPI } from "src/api/rooms";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { 
  isLoadingProfile: true, 
  isLoadingButtonChat: false,
  student: {}, 
  status: "", 
  totalClass:0,  
  profilePicture: "https://picsum.photos/200/200/?random"
}

class StudentProfileScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadPeopleInformation = async () => {
    if(this._isMounted)
     this.setState({ isLoadingProfile: true });

    const student = await StudentAPI.getDetail(this.props.currentSchool.id, this.studentId);
    if(student.gender){
      student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
    }
    const totalClass = (await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.studentId)).length;

    if(this._isMounted)
      this.setState({ isLoadingProfile: false, student, totalClass });
  }

  loadStatus = async () => {
    let status = await StatusAPI.getLatestStatus(this.studentId);
    if(!status) status = { content: "-" };
    if(this._isMounted)
      this.setState({ status: status.content });
  }
  
  handleStartChatPress = async () => {
    this.setState({ isLoadingButtonChat: true });
    const room = await PersonalRoomsAPI.createRoomIfNotExists(this.props.currentTeacher.id, this.studentId,"chat");
    this.setState({ isLoadingButtonChat: false });
    this.props.navigation.navigate("Chat", {room} );
  }

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.studentId = this.props.navigation.getParam("studentId", null);
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
              <Text>{this.props.t("loadData")}</Text>
              <Caption>{this.props.t("pleaseWait")}</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }else return (
      <View style={{ backgroundColor: "#E8EEE8"}}>
       <AppHeader
          navigation={this.props.navigation}
          title={this.props.t("studentProfile")}
          style={{ backgroundColor: "white" }}
        />
        <ScrollView style={{marginBottom: 56}}>
          <View style={{marginTop: 16}}/>
          <ProfileHeader
            style={{padding:16}}
            profilePicture={(this.state.student.profilePicture)? this.state.student.profilePicture.downloadUrl : this.state.profilePicture }
            title={this.state.student.name}
            subtitle= {"NIM " + ((!this.state.student)?this.state.student.noInduk:"-")}/>

          <View style={{ marginTop:16, paddingHorizontal: 16, paddingVertical:8, backgroundColor: "#fff" }}>
            <Text style={{fontWeight: "bold"}}>Status</Text>
            <View style={{flexDirection:"row"}}>
            <Text style={{lineHeight: 20}}>{this.state.status}</Text>
            </View>
          </View>
          
          <View style={{  marginVertical: 16 }}>
            {(this.state.student.creationTime)? 
                <PeopleInformationContainer
                fieldName={this.props.t("joinDate")}
                fieldValue={moment(this.state.student.creationTime.seconds * 1000).format("DD MMMM YYYY")}/>
              : <View/>}
            
            <PeopleInformationContainer
              fieldName={this.props.t("address")}
              fieldValue={this.state.student.address}/>
            <PeopleInformationContainer
              fieldName={this.props.t("phoneNo")}
              fieldValue={(this.state.student.phoneNumber==="000000")?"-":this.state.student.phoneNumber}/>
            <PeopleInformationContainer
              fieldName="Email"
              fieldValue={this.state.student.email}/>
            <PeopleInformationContainer
              fieldName={this.props.t("gender")}
              fieldValue={this.state.student.gender}/>
          
          </View>
          <View>
            <PeopleInformationContainer
              fieldName={this.props.t("totalClass")}
              fieldValue={this.state.totalClass}/>
          </View>
          <Button 
            disabled={(this.props.currentTeacher.id===this.studentId)?true:false}
            text={this.props.t("startConversation")}
            isLoading={this.state.isLoadingButtonChat} 
            style={{margin: 16}} 
            onPress={this.handleStartChatPress}></Button>
        </ScrollView>
      </View>
    )
  }
}
export default withTranslation()(withCurrentTeacher(StudentProfileScreen))
