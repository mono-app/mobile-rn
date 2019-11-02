import React from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import Button from "src/components/Button";
import TaskAPI from "modules/Classroom/api/task"
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { StackActions } from "react-navigation";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = {
  isLoading: false,
  taskTitle: "",
  dueDate: {},
  taskDetail: "",
  classId: "",
  subject: "",
  subjectDesc: "",
  isDateTimePickerVisible: false
};
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";


class AddTaskScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleTaskDetailChange = taskDetail => {
    this.setState({ taskDetail });
  };

  handleTaskTitleChange = taskTitle => {
    this.setState({ taskTitle });
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleClassPickPress = () => {
    payload = {
      result: (classId, subject, subjectDesc) => {
        this.setState({ classId, subject, subjectDesc });
      }
    };
    this.props.navigation.navigate("AddTaskClassPicker", payload);
  };

  handleDatePicked = date => {
    this.setState({ dueDate: date });
    
    this.hideDateTimePicker();
  };

  handleSavePress = () => {
    this.setState({ isLoading: true });

    TaskAPI.addTask(this.props.currentSchool.id, this.state.classId, {title: this.state.taskTitle, dueDate: this.state.dueDate, details: this.state.taskDetail}).then(() => {
      this.setState({ isLoading: false });

      payload = {
        classId: this.state.classId,
        subject: this.state.subject,
        subjectDesc: this.state.subjectDesc
      };

      const replaceAction = StackActions.replace({
        routeName: "TaskList",
        params: payload
      });

      this.props.navigation.dispatch(replaceAction);

    });;
   

  };

  constructor(props) {
    super(props);
    INITIAL_STATE.classId = this.props.navigation.getParam("classId", "");
    INITIAL_STATE.subject = this.props.navigation.getParam("subject", "");
    INITIAL_STATE.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    INITIAL_STATE.dueDate = moment().toDate();
    this.state = INITIAL_STATE;
    this.handleTaskTitleChange = this.handleTaskTitleChange.bind(this);
    this.handleTaskDetailChange = this.handleTaskDetailChange.bind(this);
    this.showDateTimePicker = this.showDateTimePicker.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.handleClassPickPress = this.handleClassPickPress.bind(this);
    this.handleSavePress = this.handleSavePress.bind(this);
  }

  render() {
    return (
      <View style={{ backgroundColor: "#E8EEE8" }}>
         <AppHeader
          navigation={this.props.navigation}
          title={this.props.t("addTask")}
          style={{ backgroundColor: "white" }}
        />
        <ScrollView style={{marginBottom:56}}>
          <View>
            <TouchableOpacity onPress={this.handleClassPickPress}>
              <View
                style={{
                  marginTop: 16,
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  padding: 16,
                  alignItems: "center"
                }}
              >
                <View style={styles.listDescriptionContainer}>
                  <View style={{flexDirection:"row", justifyContent: 'center', alignItems: 'center'}}>
                    <MaterialIcons name="web-asset" size={45} style={{marginRight: 8}}/>
                    {!this.state.classId ? (
                      <View>
                        <Text style={styles.label}>{this.props.t("selectMyClass")}</Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.label}>{this.state.subject}</Text>
                        <Text style={styles.label}>{this.state.subjectDesc}</Text>
                      </View>
                    )}
                    </View>
                  <View style={{ flexDirection: "row", textAlign: "right" }}>
                    <EvilIcons
                      name="chevron-right"
                      size={24}
                      style={{ color: "#5E8864" }}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 16, padding: 16, backgroundColor: "#fff" }}>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>{this.props.t("taskTitle")}</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8" }}
                value={this.state.taskTitle}
                onChangeText={this.handleTaskTitleChange}
              />
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>{this.props.t("dueDateTitle")}</Text>
              <TouchableOpacity onPress={this.showDateTimePicker}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text style={styles.label}>
                      {moment(this.state.dueDate).format("DD MMMM YYYY HH:mm")}
                    </Text>
                    <View style={{ flexDirection: "row", textAlign: "right" }}>
                      <EvilIcons
                        name="calendar"
                        size={24}
                        style={{ color: "#5E8864" }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>{this.props.t("taskDetails")}</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8", textAlignVertical: "top", maxHeight: 80 }}
                value={this.state.taskDetail}
                multiline={true}
                numberOfLines = {4}
                onChangeText={this.handleTaskDetailChange}
              />
            </View>
            <View style={{ paddingVertical: 8 }} />
            <Button
              text={this.props.t("save")}
              isLoading={this.state.isLoading}
              disabled={this.state.isLoading}
              onPress={this.handleSavePress}
            />
          </View>
        </ScrollView>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode={"datetime"}
        />
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
    marginTop: 16,
    backgroundColor: "#E8EEE8",
    flexDirection: "row",
    borderRadius: 8,
    padding: 16,
    paddingVertical: 12,
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
});
export default withTranslation()(withCurrentTeacher(AddTaskScreen))
