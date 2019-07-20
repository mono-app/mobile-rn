import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Surface, IconButton, withTheme } from "react-native-paper";

import MicButton from "src/components/ChatBottomTextInput/MicButton";
import SpeakerButton from "src/components/ChatBottomTextInput/SpeakerButton";

const INITIAL_STATE = { message: "" }

class ChatBottomTextInput extends React.PureComponent{
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
    const { colors } = this.props.theme;
    return (
      <Surface style={{ margin: 8, marginHorizontal: 16, overflow: "hidden", borderRadius: 32, elevation: 8 }}>
        <View style={{ paddingHorizontal: 8, backgroundColor: "white", flexDirection: "row", borderTopStartRadius: 32, borderTopEndRadius: 32, borderBottomColor: colors.disabled, borderBottomWidth: 1, overflow: "hidden" }}>
          <MicButton/>
          <SpeakerButton/>
        </View>
        <View style={{ flexDirection: "row", padding: 2, paddingHorizontal: 16 , backgroundColor: "white", borderBottomStartRadius: 32, borderBottomEndRadius: 32, overflow: "hidden" }}>
          <TextInput
            ref={i => this.txtMessage = i}
            autoFocus={true}
            placeholder="Tuliskan pesan..."
            style={{ flex: 1 }}
            value={this.state.message}
            onChangeText={this.handleMessageChange}/>
          <IconButton icon="send" size={24} color={colors.primary} style={{ flex: 0 }} onPress={this.handleSendPress}/>
        </View>
      </Surface>
    )
  }
}

export default withTheme(ChatBottomTextInput);

const styles = StyleSheet.create({
  inputBoxContainer: {
    elevation: 8, paddingHorizontal: 16, padding: 2, margin: 8, marginHorizontal: 16,
    borderRadius: 999, overflow: "hidden"
  }
})