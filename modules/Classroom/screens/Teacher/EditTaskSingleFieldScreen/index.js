import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Title, Caption, Drawer } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import { SchoolsCollection,ClassesCollection,TasksCollection } from "src/api/database/collection";
import { Document } from "src/api/database/document";
import { UpdateDocument } from "src/api/database/query";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import moment from "moment"
import DateTimePicker from "react-native-modal-datetime-picker";
import { withTranslation } from 'react-i18next';
import AppHeader from "src/components/AppHeader";

class EditTaskSingleFieldScreen extends React.PureComponent{
  static navigationOptions = () => {
    return { header: null };
  };

  handleDefaultValueChange = defaultValue => this.setState({ defaultValue });

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleClassPickPress = () => {
    payload = {
      result : (classId, subject, subjectDesc) => {this.setState({classId, subject, subjectDesc})}
    }
    this.props.navigation.navigate("AddTaskClassPicker", payload);
  }
  
  handleDatePicked = date => {
    this.setState({defaultValue: date})
    this.hideDateTimePicker();
  };

  handleSavePress = () => {
    this.setState({ isLoading: true });

    let canSave = false;
    if(this.beforeSave){
      canSave = this.beforeSave(this.state.defaultValue);
    }else canSave = true;

    if(canSave){
      const databaseFieldName = this.props.navigation.getParam("databaseFieldName", null);
      const schoolId = this.props.navigation.getParam("schoolId", null);
      const classId = this.props.navigation.getParam("classId", null);
      const taskId = this.props.navigation.getParam("taskId", null);

      const schoolsCollection = new SchoolsCollection();
      const classesCollection = new ClassesCollection();
      const tasksCollection = new TasksCollection();
      const schoolDocument = new Document(schoolId);
      const classDocument = new Document(classId);
      const taskDocument = new Document(taskId);
      const updateQuery = new UpdateDocument();

      let updateObject = {};
      updateObject[`${databaseFieldName}`] = this.state.defaultValue;
      if(databaseFieldName==="email"){
        updateObject['isActive'] = false;
      }
      updateQuery.executeQuery3(schoolsCollection, classesCollection,tasksCollection, schoolDocument, classDocument, taskDocument, updateObject).then( () => {
        this.setState({ isLoading: false });
        const { navigation } = this.props;
        navigation.state.params.onRefresh(this.state.defaultValue);
        navigation.goBack();
      });
    }else this.setState({ isLoading: false });
  }

  constructor(props){
    super(props);
    this.state = {
      defaultValue: this.props.navigation.getParam("fieldValue", ""),
      isLoading: false,
      isDateTimePickerVisible: false
    }
    this.keyboardType="default";
    this.isNumber = this.props.navigation.getParam("isNumber", false);
    this.isMultiline = this.props.navigation.getParam("isMultiline", false);
    this.isGender = this.props.navigation.getParam("isGender", false);
    this.isDatetimePicker = this.props.navigation.getParam("isDatetimePicker", false);
    if(this.isNumber){
      this.keyboardType="numeric"
    }
    this.placeholder = this.props.navigation.getParam("placeholder", "");
    this.caption = this.props.navigation.getParam("caption", null);
    this.title = this.props.navigation.getParam("fieldTitle", "");
    this.beforeSave = this.props.navigation.getParam("beforeSave", null);
    this.pickerType = this.props.navigation.getParam("pickerType", "datetime");
    this.handleDefaultValueChange = this.handleDefaultValueChange.bind(this);
    this.handleSavePress = this.handleSavePress.bind(this);
  }

  render(){
    const placeholder = (this.placeholder !== "")? this.placeholder: this.state.defaultValue;
    return(
      <View style={{flex:1}}>
        <AppHeader navigation={navigation} style={{ backgroundColor: "#E8EEE8" }}/>
        <View style={styles.container}>
          <Title style={{ marginBottom: 8 }}>{this.title}</Title>
          {(this.isGender)?
            <Card style={{paddingTop: 8}}>
              <Drawer.Section>
                <Drawer.Item
                  label={this.props.t("male")}
                  active={this.state.defaultValue === 'pria'}
                  onPress={() => { this.setState({ defaultValue: 'pria' }); }}
                />
                <Drawer.Item
                  label={this.props.t("female")}
                  active={this.state.defaultValue === 'wanita'}
                  onPress={() => { this.setState({ defaultValue: 'wanita' }); }}
                />
              </Drawer.Section>
            </Card>
            :
            (this.isDatetimePicker)?
            <TouchableOpacity onPress={this.showDateTimePicker}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  {(this.pickerType=="date")? 
                    <Text style={styles.label}>{moment(this.state.defaultValue).format("DD MMMM YYYY")}</Text>
                  : 
                    <Text style={styles.label}>{moment(this.state.defaultValue).format("HH:mm")}</Text>
                  }

                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="calendar" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            :
            <TextInput
              style={(this.isMultiline)?{textAlignVertical: "top", maxHeight: 80 }:{}}
              placeholder={placeholder}
              value={this.state.defaultValue}
              multiline={this.isMultiline}
              numberOfLines={(this.isMultiline)?3:1}
              keyboardType={this.keyboardType}
              onChangeText={this.handleDefaultValueChange}/>
          }
          
          {this.caption !== null?(
            <Caption>{this.caption}</Caption>
          ):null}
          <View style={{ paddingVertical: 8 }}/>
          <Button
            text={this.props.t("save")}
            isLoading={this.state.isLoading}
            onPress={this.handleSavePress}/>
            <DateTimePicker
            date={(this.isDatetimePicker && this.state.defaultValue)?this.state.defaultValue:new Date()}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode={this.pickerType}
          />
        </View>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#E8EEE8" },
  listItemContainer: {
    marginTop: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius:8,
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
})

export default withTranslation()(EditTaskSingleFieldScreen)