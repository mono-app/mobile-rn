import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "src/components/Button";
import { Text, Button as ButtonDialog, Dialog, Portal, RadioButton} from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SubmissionAPI from "modules/Classroom/api/submission";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = {
  isLoading: false,
  defaultValue: "",
  note: "",
  type: 0,
  visible: true,
  checked: 0
};
class SubmissionScoringScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };
  handleScoreChange = defaultValue => {
    this.setState({defaultValue})
  }
  handleNoteChange = note => {
    this.setState({note})
  }

  handleSavePress = () => {
    this.setState({ isLoading: true });
    data = {
      score: this.state.defaultValue,
      note: this.state.note
    }
    SubmissionAPI.addScore(this.props.currentSchool.id, this.classId, this.taskId, this.submissionId, data).then(() => {
      const { navigation } = this.props;
      navigation.state.params.onRefresh(this.state.defaultValue);
      navigation.goBack();   
    }).catch(err => console.log(err));
  };

  _hideDialog = () => {
    this.setState({type: this.state.checked, visible: false})
  
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.submissionId = this.props.navigation.getParam("submissionId", "");
    this.handleSavePress = this.handleSavePress.bind(this);
    this.handleScoreChange = this.handleScoreChange.bind(this);
  }

  render() {
    return (
      <View style={{flex:1,display:"flex",backgroundColor: "white"}}>
        <AppHeader
            navigation={this.props.navigation}
            style={{ backgroundColor: "white" }}
            title="Beri Penilaian"
          />
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{flex:1}}>
                <View style={{ margin: 16 }}>
                  <Text style={styles.label}>{this.props.t("inputScore")}</Text>
                </View>
                <View style={{ marginHorizontal: 16 }}>
                  <TextInput
                    placeholder=""
                    style={{ backgroundColor: "#E8EEE8" }}
                    keyboardType={(this.state.type===1)? "numeric": ""}
                    value={this.state.defaultValue}
                    onChangeText={this.handleScoreChange}/>
                </View>
                <View style={{ marginHorizontal: 16, marginBottom:16 }}>
                  <Text style={styles.label}>{this.props.t("note")}</Text>
                </View>
                <View style={{ marginHorizontal: 16 }}>
                  <TextInput
                    style={{ backgroundColor: "#E8EEE8", textAlignVertical: "top", maxHeight: 80 }}
                    placeholder=""
                    multiline={true}
                    numberOfLines = {5}
                    value={this.state.note}
                    onChangeText={this.handleNoteChange}/>
                </View>
              
                
                {(this.state.type===1||this.state.type===2) ? 
                  <Button
                  text={this.props.t("save")}
                  isLoading={this.state.isLoading}
                  disabled={this.state.isLoading}
                  onPress={this.handleSavePress}
                  style={{margin: 16}}
                />
                :
                  
                <Portal>
                  <Dialog
                    visible={this.state.visible}>
                    <Dialog.Title>{this.props.t("selectScoreFormat")}</Dialog.Title>
                    <Dialog.Content>
                    <RadioButton.Group
                      onValueChange={checked => this.setState({ checked })}
                      value={this.state.checked}
                    >
                      <View style={{flexDirection: "row", alignItems:"center"}}>
                        <RadioButton
                          value={1}
                        />
                       <Text>{this.props.t("number")}</Text>
                      </View>
                      <View style={{flexDirection: "row", alignItems:"center"}}>
                        <RadioButton
                          value={2}
                        />
                        <Text>{this.props.t("alphabet")}</Text>
                      </View>
                    </RadioButton.Group>
                  
                    </Dialog.Content>
                    <Dialog.Actions>
                      <ButtonDialog onPress={this._hideDialog}>OK</ButtonDialog>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
                }
                
        </KeyboardAwareScrollView>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  smallDescription: { fontSize: 12, textAlign: "left", color: "#5E8864" },
  label: { fontSize: 14, textAlign: "left", color: "#000000" }
});
export default withTranslation()(withCurrentTeacher(SubmissionScoringScreen))
