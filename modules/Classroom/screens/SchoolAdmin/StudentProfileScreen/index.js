import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Title, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import ClassAPI from "modules/Classroom/api/class";
import CircleAvatar from "src/components/Avatar/Circle";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = { isLoadingProfile: true, student: null, totalActiveClass: 0, profilePicture: "https://picsum.photos/200/200/?random"}

class StudentProfileScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadPeopleInformation = async () => {
    if(this._isMounted){
      this.setState({ isLoadingProfile: true });
    }

    const student = await StudentAPI.getDetail(this.props.currentSchool.id, this.studentEmail);
    if(student.gender){
      student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
    }
    const totalActiveClass = (await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.studentEmail)).length;

    if(this._isMounted){
      this.setState({ isLoadingProfile: false, student, totalActiveClass });
    }
  }

  handleNamePress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "name", 
      fieldValue: this.state.student.name,
      fieldTitle: "Edit Nama Murid",
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.student));
        newClass.name = data;
        this.setState({student: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleAddressPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "address", 
      fieldValue: this.state.student.address,
      fieldTitle: "Edit Alamat",
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.student));
        newClass.address = data;
        this.setState({student: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handlePhonePress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "phone", 
      fieldValue: this.state.student.phone,
      fieldTitle: "Edit Telepon",
      isNumber: true,
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.student));
        newClass.phone = data;
        this.setState({student: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleEmailPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "id", 
      fieldValue: this.state.student.id,
      fieldTitle: "Edit Email",
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.student));
        newClass.email = data;
        this.setState({student: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleNoIndukPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "noInduk", 
      fieldValue: this.state.student.noInduk,
      fieldTitle: "Edit No Induk",
      isNumber: true,
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.student));
        newClass.noInduk = data;
        this.setState({student: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleGenderPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "gender", 
      fieldValue: this.state.student.gender,
      fieldTitle: "Edit Jenis Kelamin",
      isGender: true,
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.student));
        newClass.gender = data.charAt(0).toUpperCase() + data.slice(1);
        this.setState({student: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleClassListPress = e => {
    const payload = {
      studentEmail: this.studentEmail
    }
    this.props.navigation.navigate('StudentClassList', payload);
  }
  

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.studentEmail = this.props.navigation.getParam("studentEmail", null);
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.handleNamePress = this.handleNamePress.bind(this);
    this.handleAddressPress = this.handleAddressPress.bind(this);
    this.handlePhonePress = this.handlePhonePress.bind(this);
    this.handleEmailPress = this.handleEmailPress.bind(this);
    this.handleNoIndukPress = this.handleNoIndukPress.bind(this);
    this.handleGenderPress = this.handleGenderPress.bind(this);
  }

  componentDidMount(){ 
    this._isMounted = true;
    this.loadPeopleInformation(); 
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
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <AppHeader
            navigation={this.props.navigation}
            title="Profil Murid"
            style={{ backgroundColor: "white" }}
          />
        <ScrollView>
          <View style={{padding: 16}}>
            <Title style={{ marginLeft: 16}}>{(this.state.student.noInduk)? this.state.student.noInduk  : "-"} / {this.state.student.name}</Title>
            <View style={styles.profileContainer}>
              <Text style={{  fontSize: 16 }}></Text>            
              <CircleAvatar size={100} uri={(this.state.student.profilePicture)? this.state.student.profilePicture.downloadUrl : this.state.profilePicture }/>
            </View>
            <View>
              <TouchableOpacity onPress={this.handleNamePress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Nama murid</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.name}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.handleAddressPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Alamat</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.address}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.handlePhonePress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Nomor Telepon</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.phone}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Email</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.id}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#ffffff" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.handleNoIndukPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>No Induk</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.student.noInduk}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleGenderPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Jenis Kelamin</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.student.gender}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleClassListPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Jumlah Kelas</Text>
                    <View style={{flexDirection:"row", textAlign: "right"}}>
                      <Text>{this.state.totalActiveClass}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
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
export default withCurrentSchoolAdmin(StudentProfileScreen)
