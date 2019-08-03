import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Card, Dialog, Text, Caption, TextInput } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import CurrentUserAPI from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people";
import moment from "moment"

const INITIAL_STATE = { isLoadingProfile: true, student: {}, status:"", studentEmail:"" ,schoolId: "1hZ2DiIYSFa5K26oTe75" }

/**
 * Parameter list
 * 
 * @param {string} studentEmail
 */
export default class MyProfileScreen extends React.PureComponent {
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

    const api = new StudentAPI();
    const promises = [ api.getDetail(this.state.schoolId, this.studentEmail)];

    Promise.all(promises).then(results => {
      const student = results[0];
      if(student.gender){
        student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
      }
      this.setState({ isLoadingProfile: false, student });
    })
  }

  
  loadStatus = () => {
    CurrentUserAPI.getCurrentUserEmail().then(currentUserEmail => {
      return new PeopleAPI().getLatestStatus(currentUserEmail);
    }).then(status => {
      if(!status) status = { content: "Tulis statusmu disini..." };
      this.setState({ status: status.content });
    })
  }

  handleTaskListPress = () => this.props.navigation.navigate("ArchiveList",{"studentEmail": this.state.student.id })
  
  handleStatusPress = () => {
    const payload = {
      onRefresh: this.loadStatus
    }
    this.props.navigation.navigate("StatusChange",payload)
  }

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.loadStatus = this.loadStatus.bind(this);
    this.studentEmail = this.props.navigation.getParam("studentEmail", "");
    console.log(this.studentEmail);

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
          <PeopleProfileHeader
            profilePicture="https://picsum.photos/200/200/?random"
            nickName={this.state.student.name}
            status= {"NIK " + this.state.student.noInduk}/>

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
              fieldValue={moment(this.state.student.creationTime.seconds * 1000).format("DD MMMM YYYY")}/>
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
            <PeopleInformationContainer
              fieldName="Jumlah Kelas"
              fieldValue="-"/>
            <TouchableOpacity onPress={this.handleTaskListPress}>
              <PeopleInformationContainer
                fieldName="Riwayat Kelas"
                fieldValue="-"/>
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