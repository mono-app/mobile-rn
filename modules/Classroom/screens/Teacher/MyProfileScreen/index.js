import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Card, Dialog, Text, Caption, TextInput } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import TeacherAPI from "../../../api/teacher";
import { ScrollView } from "react-native-gesture-handler";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";

const INITIAL_STATE = { isLoadingProfile: true, teacher: null, schoolId: "1hZ2DiIYSFa5K26oTe75" }

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

    const api = new TeacherAPI();
      const promises = [ api.getDetail("1hZ2DiIYSFa5K26oTe75", this.teacherEmail)];

      Promise.all(promises).then(results => {
        const teacher = results[0];
        this.setState({ isLoadingProfile: false, teacher });
      })
  }

  handleNamePress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherEmail,
      databaseFieldName: "name", 
      fieldValue: this.state.teacher.name,
      fieldTitle: "Edit Nama Guru",
      onRefresh: () => {this.loadPeopleInformation()} 
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleAddressPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherEmail,
      databaseFieldName: "address", 
      fieldValue: this.state.teacher.address,
      fieldTitle: "Edit Alamat",
      onRefresh: () => {this.loadPeopleInformation()} 
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handlePhonePress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherEmail,
      databaseFieldName: "phone", 
      fieldValue: this.state.teacher.phone,
      fieldTitle: "Edit Telepon",
      isNumber: true,
      onRefresh: () => {this.loadPeopleInformation()} 
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleEmailPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherEmail,
      databaseFieldName: "email", 
      fieldValue: this.state.teacher.email,
      fieldTitle: "Edit Email",
      onRefresh: () => {this.loadPeopleInformation()} 
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleNIKPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherEmail,
      databaseFieldName: "nik", 
      fieldValue: this.state.teacher.nik,
      fieldTitle: "Edit NIK",
      isNumber: true,
      onRefresh: () => {this.loadPeopleInformation()} 
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleGenderPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherEmail,
      databaseFieldName: "gender", 
      fieldValue: this.state.teacher.gender,
      fieldTitle: "Edit Jenis Kelamin",
      isGender: true,
      onRefresh: () => {this.loadPeopleInformation()} 
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  constructor(props){
    super(props);
    this.teacherEmail = this.props.navigation.getParam("teacherEmail", null);
    this.state = INITIAL_STATE;
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.handleNamePress = this.handleNamePress.bind(this);
    this.handleAddressPress = this.handleAddressPress.bind(this);
    this.handlePhonePress = this.handlePhonePress.bind(this);
    this.handleEmailPress = this.handleEmailPress.bind(this);
    this.handleNIKPress = this.handleNIKPress.bind(this);
    this.handleGenderPress = this.handleGenderPress.bind(this);
  }

  componentDidMount(){ 
    this.loadPeopleInformation(); 
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
            nickName="Henry Sanders"
            status="NIK 3542354345234513235"/>

          <View style={styles.statusContainer}>
            <Text style={styles.label}>Status saya</Text>
            <View style={{flexDirection:"row"}}>
              <Text>Statuss</Text>
            </View>
            
          </View>
          <View style={{  marginBottom: 16 }}>
           <PeopleInformationContainer
              fieldName="Bergabung Sejak"
              fieldValue="17 Juli 2001"/>
          </View>
          
          <View style={{  marginBottom: 16 }}>
            
            <PeopleInformationContainer
              fieldName="Alamat"
              fieldValue="-"/>
            <PeopleInformationContainer
              fieldName="Nomor Telepon"
              fieldValue="-"/>
            <PeopleInformationContainer
              fieldName="Email"
              fieldValue="-"/>
            <PeopleInformationContainer
              fieldName="Jenis Kelamin"
              fieldValue="-"/>
          
          </View>
          <View style={{  marginBottom: 16 }}>
            <PeopleInformationContainer
              fieldName="Jumlah Kelas"
              fieldValue="-"/>
            <PeopleInformationContainer
              fieldName="Arsip Tugas"
              fieldValue="-"/>
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