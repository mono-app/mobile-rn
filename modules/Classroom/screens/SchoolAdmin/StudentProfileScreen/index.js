import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Title, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "modules/Classroom/api/student";
import ClassAPI from "modules/Classroom/api/class";
import CircleAvatar from "src/components/Avatar/Circle";
import { ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";
import { withTranslation } from 'react-i18next';

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

    const student = await StudentAPI.getDetail(this.props.currentSchool.id, this.studentId);
    if(student.gender){
      student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
    }
    const totalActiveClass = (await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.studentId)).length;

    if(this._isMounted){
      this.setState({ isLoadingProfile: false, student, totalActiveClass });
    }
  }

  handleNamePress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "students",
      databaseDocumentId: this.studentId,
      databaseFieldName: "name", 
      fieldValue: this.state.student.name,
      fieldTitle: this.props.t("editStudentName"),
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
      databaseDocumentId: this.studentId,
      databaseFieldName: "address", 
      fieldValue: this.state.student.address,
      fieldTitle: this.props.t("editAddress"),
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.student));
        newClass.address = data;
        this.setState({student: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleNoIndukPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "students",
      databaseDocumentId: this.studentId,
      databaseFieldName: "noInduk", 
      fieldValue: this.state.student.noInduk,
      fieldTitle: this.props.t("editStudentId"),
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
      databaseDocumentId: this.studentId,
      databaseFieldName: "gender", 
      fieldValue: this.state.student.gender,
      fieldTitle: this.props.t("editGender"),
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
      studentId: this.studentId
    }
    this.props.navigation.navigate('StudentClassList', payload);
  }
  

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.studentId = this.props.navigation.getParam("studentId", null);
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.handleNamePress = this.handleNamePress.bind(this);
    this.handleAddressPress = this.handleAddressPress.bind(this);
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
              <Text>{this.props.t("loadData")}</Text>
              <Caption>{this.props.t("pleaseWait")}</Caption>
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
                    <Text style={styles.label}>{this.props.t("studentName")}</Text>
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
                    <Text style={styles.label}>{this.props.t("address")}</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.address}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity disabled={true}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>{this.props.t("phoneNo")}</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.phoneNumber}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#fff" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity disabled={true}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Email</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.email}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#fff" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.handleNoIndukPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>{this.props.t("studentNo")}</Text>
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
                    <Text style={styles.label}>{this.props.t("gender")}</Text>
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
                    <Text style={styles.label}>{this.props.t("totalClass")}</Text>
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
export default withTranslation()(withCurrentSchoolAdmin(StudentProfileScreen))
