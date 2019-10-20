import React from "react";
import { StyleSheet } from "react-native";

import { View, TextInput } from "react-native";
import { Surface, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-navigation";

const INITIAL_STATE = { message: "" }

export default class BottomTextInput extends React.PureComponent{
  handleMessageChange = message => this.setState({ message });
  handleSendPress = () => {
    if(this.props.onSendPress) this.props.onSendPress(this.state.message);
  }

  clear = () => this.setState({ message: "" });
  requestFocus = () => {
    if(this.txtMessage !== null) this.txtMessage.focus();
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.txtMessage = null;
    this.requestFocus = this.requestFocus.bind(this);
    this.clear = this.clear.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSendPress = this.handleSendPress.bind(this);
  }

  render(){
    return(
      <SafeAreaView>
        <Surface style={{...this.props.style, ...styles.inputBoxContainer}}>
          <View style={{ flexDirection: "row" }}>
            <TextInput 
              ref={i => this.txtMessage = i} 
              autoFocus={(this.props.autoFocus)?this.props.autoFocus:false}
              placeholder="Type a message" 
              style={{ flex: 1, maxHeight: 100 }}
              multiline={true}
              value={this.state.message}
              onChangeText={this.handleMessageChange}/>
            <IconButton icon="send" size={24} color="#0EAD69" style={{ flex: 0, alignSelf:"centers" }} onPress={this.handleSendPress}/>
          </View>
        </Surface>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  inputBoxContainer: {
    elevation: 8, paddingHorizontal: 16, padding: 2, margin: 8, marginHorizontal: 8,
    borderRadius: 999, overflow: "hidden"
  }
})