import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Title, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "../../../api/student";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment"
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import PeopleAPI from "src/api/people";
import Button from "src/components/Button";

const INITIAL_STATE = { isLoadingProfile: true, student: {}, status: "" , schoolId: "1hZ2DiIYSFa5K26oTe75"  }

/**
 * Parameter list
 * 
 * @param {string} studentEmail
 */
export default class StudentProfileScreen extends React.PureComponent {
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

    const student = StudentAPI.getDetail(this.state.schoolId, this.studentEmail);
    if(student.gender){
      student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
    }
    this.setState({ isLoadingProfile: false, student });

  }

  loadStatus = () => {
    new PeopleAPI().getLatestStatus(this.studentEmail).then(status => {
      if(!status) status = { content: "-" };
      this.setState({ status: status.content });
    })
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
            profilePicture="https://picsum.photos/200/200/?random"
            nickName={this.state.student.name}
            status= {"NIM " + ((!this.state.student)?this.state.student.noInduk:"-")}/>


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
              fieldValue="-"/>
          </View>
          <Button text="Mulai Percakapan" style={{margin: 16}}></Button>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    fontWeight: "bold"
  }
})