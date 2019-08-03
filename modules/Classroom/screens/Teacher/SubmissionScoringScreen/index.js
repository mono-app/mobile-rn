import React from "react";
import Button from "src/components/Button";
import { View, StyleSheet } from "react-native";
import { Text, Drawer, Card, Dialog, Portal, RadioButton} from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SubmissionAPI from "../../../api/submission";

const INITIAL_STATE = {
  isLoading: false,
  defaultValue: "",
  type: 0,
  visible: true,
  checked: 0
};
export default class SubmissionScoringScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          style={{ backgroundColor: "transparent" }}
          title="Beri Penilaian"
        />
      )
    };
  };
  handleScoreChange = defaultValue => {
    this.setState({defaultValue})
  }

  handleSavePress = () => {
    this.setState({ isLoading: true });
    SubmissionAPI.addScore(this.schoolId, this.classId, this.taskId, this.submissionId, this.state.defaultValue).then(() => {
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
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.submissionId = this.props.navigation.getParam("submissionId", "");
    this.handleSavePress = this.handleSavePress.bind(this);
    this.handleScoreChange = this.handleScoreChange.bind(this);
  }

  render() {
    return (
      <View style={{flex:1,display:"flex",backgroundColor: "#E8EEE8"}}>
        <KeyboardAwareScrollView style={{flex:1}}>
                <View style={{ margin: 16 }}>
                  <Text style={styles.label}>Input Nilai</Text>
                </View>
                {this.state.type===1? 
                <View style={{ marginHorizontal: 16 }}>
                  <TextInput
                    style={{ marginBottom: 0 }}
                    placeholder=""
                    keyboardType="numeric"
                    value={this.state.defaultValue}
                    onChangeText={this.handleScoreChange}/>
                </View>
                : 
                this.state.type===2? 
                <View style={{ marginHorizontal: 16 }}>
                  <Card style={{paddingTop: 8}}>
                    <Drawer.Section>
                      <Drawer.Item
                        label="A"
                        active={this.state.defaultValue === 'A'}
                        onPress={() => { this.setState({ defaultValue: 'A' }); }}
                      />
                      <Drawer.Item
                        label="AB"
                        active={this.state.defaultValue === 'AB'}
                        onPress={() => { this.setState({ defaultValue: 'AB' }); }}
                      />
                       <Drawer.Item
                        label="B"
                        active={this.state.defaultValue === 'B'}
                        onPress={() => { this.setState({ defaultValue: 'B' }); }}
                      />
                       <Drawer.Item
                        label="BC"
                        active={this.state.defaultValue === 'BC'}
                        onPress={() => { this.setState({ defaultValue: 'BC' }); }}
                      />
                       <Drawer.Item
                        label="C"
                        active={this.state.defaultValue === 'C'}
                        onPress={() => { this.setState({ defaultValue: 'C' }); }}
                      />
                       <Drawer.Item
                        label="D"
                        active={this.state.defaultValue === 'D'}
                        onPress={() => { this.setState({ defaultValue: 'D' }); }}
                      />
                       <Drawer.Item
                        label="E"
                        active={this.state.defaultValue === 'E'}
                        onPress={() => { this.setState({ defaultValue: 'E' }); }}
                      />
                       <Drawer.Item
                        label="F"
                        active={this.state.defaultValue === 'F'}
                        onPress={() => { this.setState({ defaultValue: 'F' }); }}
                      />
                    </Drawer.Section>
                  </Card>
                </View>
                :
                <View/>
                }
                
                {(this.state.type===1||this.state.type===2) ? 
                  <Button
                  text="Simpan"
                  isLoading={this.state.isLoading}
                  onPress={this.handleSavePress}
                  style={{margin: 16}}
                />
                :
                  
                <Portal>
                  <Dialog
                    visible={this.state.visible}>
                    <Dialog.Title>Pilih Format Penilaian</Dialog.Title>
                    <Dialog.Content>
                    <RadioButton
                      value="Angka"
                      status={this.state.checked === 1 ? 'checked' : 'unchecked'}
                      onPress={() => { this.setState({ checked: 1 }); }}
                    />
                    <RadioButton
                      value="Alphabet"
                      status={this.state.checked === 2 ? 'checked' : 'unchecked'}
                      onPress={() => { this.setState({ checked: 2 }); }}
                    />
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={this._hideDialog} text="OK"></Button>
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
