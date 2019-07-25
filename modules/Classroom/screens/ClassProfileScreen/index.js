import React from "react";
import moment from "moment";
import { View,StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Card,
  Dialog,
  Text,
  Caption
} from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import ClassAPI from "../../api/class";
import CircleAvatar from "src/components/Avatar/Circle";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { isLoadingProfile: true, class: null, schoolId: "1hZ2DiIYSFa5K26oTe75" };

/**
 * Parameter list
 *
 * @param {string} classId
 */
export default class ClassProfileScreen extends React.PureComponent {
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

    const api = new ClassAPI();
    const promises = [api.getDetail("1hZ2DiIYSFa5K26oTe75", this.classId)];

    Promise.all(promises).then(results => {
      const class_ = results[0];
      this.setState({ isLoadingProfile: false, class: class_ });
    });
  };

  handleSubjectPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "subject", 
      fieldValue: this.state.class.subject,
      fieldTitle: "Edit Mata Pelajaran",
      onRefresh: () => {this.loadClassInformation()}
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleRoomPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "room", 
      fieldValue: this.state.class.room,
      fieldTitle: "Edit Ruangan",
      onRefresh: () => {this.loadClassInformation()}
    }
    console.log(payload);
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleAcademicYearPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "academicYear", 
      fieldValue: this.state.class.academicYear,
      fieldTitle: "Edit Tahun Ajaran",
      onRefresh: () => {this.loadClassInformation()}
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleSemesterPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "semester", 
      fieldValue: this.state.class.semester,
      fieldTitle: "Edit Mata Pelajaran",
      isNumber:true,
      onRefresh: () => {this.loadClassInformation()}
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleInformationPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "classes",
      databaseDocumentId: this.classId,
      databaseFieldName: "information", 
      fieldValue: this.state.class.information,
      fieldTitle: "Edit Informasi Kelas",
      isMultiline: true,
      onRefresh: () => {this.loadClassInformation()}
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
        <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <ScrollView>
          <Card style={{margin: 16}}>
            <Text style={{ marginLeft: 16, marginTop: 16, fontSize: 20 }}>{this.state.class.subject}</Text>
            <View style={styles.profileContainer}>
              <Text style={{  fontSize: 16 }}></Text>
                <CircleAvatar
                  size={80}
                  uri="https://picsum.photos/200/200/?random"
                />            
            </View>
            <View>
              <TouchableOpacity onPress={this.handleSubjectPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={{  }}>Mata Pelajaran</Text>
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
                    <Text>Ruangan</Text>
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
                    <Text>Tahun Ajaran</Text>
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
                    <Text >Semester</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.class.semester}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleInformationPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <View style={{flexDirection:"column",textAlign: "right"}}>
                      <Text>Informasi Kelas</Text>
                      <Text>{this.state.class.information}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
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
  }
})