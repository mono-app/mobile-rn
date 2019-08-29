import React from "react";
import { View,StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Title,
  Dialog,
  Text,
  Caption,
  Subheading
} from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import ClassAPI from "../../../api/class";
import SquareAvatar from "src/components/Avatar/Square";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = { isLoadingProfile: true, class: null };

class ClassProfileScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Info Kelas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadClassInformation = async () => {
    this.setState({ isLoadingProfile: true });

    const class_ = await ClassAPI.getDetail(this.props.currentSchool.id, this.classId);
    this.setState({ isLoadingProfile: false, class: class_ });

  };

  handleSubjectPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "subject", 
      fieldValue: this.state.class.subject,
      fieldTitle: "Edit Mata Pelajaran",
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.class));
        newClass.subject = data;
        this.setState({class: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleRoomPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "room", 
      fieldValue: this.state.class.room,
      fieldTitle: "Edit Ruangan",
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.class));
        newClass.room = data;
        this.setState({class: newClass})
      }
    }
    console.log(payload);
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleAcademicYearPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "academicYear", 
      fieldValue: this.state.class.academicYear,
      fieldTitle: "Edit Tahun Ajaran",
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.class));
        newClass.academicYear = data;
        this.setState({class: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleSemesterPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "semester", 
      fieldValue: this.state.class.semester,
      fieldTitle: "Edit Mata Pelajaran",
      isNumber:true,
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.class));
        newClass.semester = data;
        this.setState({class: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleInformationPress = e => {
    const payload = {
      schoolId: this.props.currentSchool.id,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "information", 
      fieldValue: this.state.class.information,
      fieldTitle: "Edit Informasi Kelas",
      isMultiline: true,
      onRefresh: (data) => {
        const newClass = JSON.parse(JSON.stringify(this.state.class));
        newClass.information = data;
        this.setState({class: newClass})
      }
    }
    this.props.navigation.navigate(`EditSingleField`, payload);

  }

  constructor(props) {
    super(props);
    this.classId = this.props.navigation.getParam("classId", null);
    this.state = INITIAL_STATE;
    this.loadClassInformation = this.loadClassInformation.bind(this);
    this.handleSubjectPress = this.handleSubjectPress.bind(this);
    this.handleRoomPress = this.handleRoomPress.bind(this);
    this.handleAcademicYearPress = this.handleAcademicYearPress.bind(this);
    this.handleSemesterPress = this.handleSemesterPress.bind(this);
    this.handleInformationPress = this.handleInformationPress.bind(this);
  }

  componentDidMount() {
    this.loadClassInformation();
  }

  render() {
    if (this.state.isLoadingProfile) {
      return (
        <Dialog visible={true}>
          <Dialog.Content
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <ActivityIndicator />
            <View>
              <Text>Sedang memuat data</Text>
              <Caption>Harap tunggu...</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      );
    } else
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView>
          <View style={{padding: 16}}>
            <Title style={{ marginLeft: 16 }}>{this.state.class.subject}</Title>
            <Subheading style={{ marginLeft: 16 }}>{this.state.class.room} | {this.state.class.academicYear} | Semester {this.state.class.semester}</Subheading>
            <View style={styles.profileContainer}>
              <Text style={{  fontSize: 16 }}></Text>
                <SquareAvatar
                  size={100}
                  uri="https://picsum.photos/200/200/?random"
                />            
            </View>
            <View>
              <TouchableOpacity onPress={this.handleSubjectPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Mata Pelajaran</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.class.subject}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleRoomPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Ruangan</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.class.room}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleAcademicYearPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Tahun Ajaran</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.class.academicYear}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleSemesterPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>Semester</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.class.semester}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleInformationPress}>
                <View style={{...styles.listItemContainer,  flexWrap: "wrap", flex: 1, justifyContent:"space-between"}}>
                  <View style={{flexDirection:"column",maxWidth: "80%"}}>
                    <Text style={styles.label}>Informasi Kelas</Text>
                    <Text>{this.state.class.information}</Text>
                  </View>
                  <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      );
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
export default withCurrentSchoolAdmin(ClassProfileScreen)
