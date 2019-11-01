import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import TeacherAPI from "modules/Classroom/api/teacher";
import ClassAPI from "modules/Classroom/api/class";
import CircleAvatar from "src/components/Avatar/Circle";
import { ScrollView } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";
import { withTranslation } from 'react-i18next';
import HelperAPI from "src/api/helper";

const INITIAL_STATE = { isLoadingProfile: true, teacher: null, totalActiveClass: 0 }

class TeacherProfileScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadPeopleInformation = async () => {
    if(this._isMounted){
      this.setState({ isLoadingProfile: true });
    }

    const teacher = await TeacherAPI.getDetail(this.props.currentSchool.id, this.teacherId);
    if(teacher.gender){
      teacher.gender = teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1)
    }
    const totalActiveClass = (await ClassAPI.getUserActiveClasses(this.props.currentSchool.id, this.teacherId)).length;
    if(this._isMounted){
      this.setState({ isLoadingProfile: false, teacher, totalActiveClass });
    }
  }

  handleNamePress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherId,
      databaseFieldName: "name", 
      fieldValue: this.state.teacher.name,
      fieldTitle: this.props.t("editTeacherName"),
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.teacher));
        newClass.name = data;
        this.setState({teacher: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleAddressPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherId,
      databaseFieldName: "address", 
      fieldValue: this.state.teacher.address,
      fieldTitle: this.props.t("editAddress"),
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.teacher));
        newClass.address = data;
        this.setState({teacher: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleNIKPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherId,
      databaseFieldName: "nik", 
      fieldValue: this.state.teacher.nik,
      fieldTitle: this.props.t("editNik"),
      isNumber: true,
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.teacher));
        newClass.nik = data;
        this.setState({teacher: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleGenderPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "teachers",
      databaseDocumentId: this.teacherId,
      databaseFieldName: "gender", 
      fieldValue: this.state.teacher.gender,
      fieldTitle: this.props.t("editGender"),
      isGender: true,
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.teacher));
        newClass.gender = data.charAt(0).toUpperCase() + data.slice(1);
        this.setState({teacher: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleClassListPress = e => {
    const payload = {
      teacherId: this.teacherId
    }
    this.props.navigation.navigate('TeacherClassList', payload);
  }
  

  constructor(props){
    super(props);
    this.teacherId = this.props.navigation.getParam("teacherId", null);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.handleNamePress = this.handleNamePress.bind(this);
    this.handleAddressPress = this.handleAddressPress.bind(this);
    this.handleNIKPress = this.handleNIKPress.bind(this);
    this.handleGenderPress = this.handleGenderPress.bind(this);
  }

  componentDidMount(){ 
    this._isMounted = true
    this.loadPeopleInformation(); 
  }

  componentWillUnmount() {
    this._isMounted = false
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
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.t("teacherProfile")}
            style={{ backgroundColor: "white" }}
          />
        <ScrollView>
          <View style={{padding: 16}}>
            <Text style={{ marginLeft: 16, fontSize: 20 }}>{(this.state.teacher.nik)? this.state.teacher.nik  : "-"} / {this.state.teacher.name}</Text>

            <View style={styles.profileContainer}>
              <Text style={{  fontSize: 16 }}></Text>
              <CircleAvatar size={100} uri={HelperAPI.getDefaultProfilePic()}/>
            </View>
            <View>
              <TouchableOpacity onPress={this.handleNamePress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>{this.props.t("teacherName")}</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.teacher.name}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleAddressPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>{this.props.t("address")}</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.teacher.address}</Text>
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
                      <Text>{this.state.teacher.phoneNumber}</Text>
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
                      <Text>{this.state.teacher.email}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#fff" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleNIKPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>{this.props.t("nik")}</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.teacher.nik}</Text>
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
                      <Text>{this.state.teacher.gender}</Text>
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

export default withTranslation()(withCurrentSchoolAdmin(TeacherProfileScreen))
