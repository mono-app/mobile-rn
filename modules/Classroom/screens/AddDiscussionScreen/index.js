import React from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import Button from "src/components/Button";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import CurrentUserAPI from "src/api/people/CurrentUser";
import DiscussionAPI from "../../api/discussion";

const INITIAL_STATE = {
  isLoading: false,
  title: "",
  description: ""
};

/**
 * Parameter list
 *
 * @param {string} classId
 */
export default class AddDiscussionScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Buat Diskusi Baru"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  handleTitleChange = title => {
    this.setState({title})
  } 
  
  handleDescriptionChange = description => {
    this.setState({description})
  }

  handleSavePress = async () => {
    this.setState({ isLoading: true });
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail()
    const data = {
      posterEmail: currentUserEmail,
      title: this.state.title,
      description: this.state.description
    }
 
    await DiscussionAPI.addDiscussion(this.schoolId, this.classId, this.taskId, data);
    this.setState({ isLoading: false });
    const { navigation } = this.props;
    navigation.state.params.onRefresh(this.state.defaultValue);
    navigation.goBack();
  };

  constructor(props) {
    super(props);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.state = INITIAL_STATE;
    this.handleSavePress = this.handleSavePress.bind(this);
  }

  render() {
    return (
      <View style={{ backgroundColor: "#E8EEE8" }}>
        <ScrollView>

          <View style={styles.subjectContainer}>
                <Text style={{fontWeight: "bold", fontSize: 18}}>
                  {this.subject}
                </Text>
                <Text style={{fontSize: 18}}>
                  {this.subjectDesc}
                </Text>
          </View>

          <View style={{ padding: 16, backgroundColor: "#fff" }}>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Topik Diskusi</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8" }}
                value={this.state.title}
                onChangeText={this.handleTitleChange}
              />
            </View>
            
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Deskripsi</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8", textAlignVertical: "top" }}
                value={this.state.description}
                multiline={true}
                numberOfLines = {5}
                onChangeText={this.handleDescriptionChange}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop:8}}>
                <EvilIcons name="image" size={24} style={{ color: "#5E8864",padding:8 }}/>
                <EvilIcons name="camera" size={24} style={{ color: "#5E8864",padding:8 }}/>
                <EvilIcons name="location" size={24} style={{ color: "#5E8864",padding:8 }}/>
               
            </View>
            <View style={{ paddingVertical: 8 }} />
            <Button
              text="Simpan"
              isLoading={this.state.isLoading}
              onPress={this.handleSavePress}
            />
          </View>
        </ScrollView>
    
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subjectContainer:{
    marginTop: 16,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
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
