import React from "react";
import { Clipboard, TouchableOpacity, View } from "react-native";
import { Dialog, Portal, Subheading } from "react-native-paper";
import Toast from 'react-native-easy-toast'
import PropTypes from "prop-types";
import PeopleAPI from "../../api/people";

function ChatLongPressDialog(props){
  const { visible, message } = props
  const toastRef = React.useRef(null);

  const handleCopyPress = async () => {
    await Clipboard.setString(message.content)
    toastRef.current.show('Copied to clipboard!', 1000);
    props.onDismiss()
  }

  const handleReplyPress = async () => {
    const cloneMessage = {}
    cloneMessage["id"] = message.id
    cloneMessage["content"] = message.content
    cloneMessage["name"] = (await PeopleAPI.getDetail(message.senderId)).applicationInformation.nickName
    props.onReplyPress(cloneMessage)
    props.onDismiss()
  }

  const handleFowardPress = () => {
    
    props.onDismiss()
  }

  return (
    <Portal>
      <Dialog
          visible={visible}
          onDismiss={props.onDismiss}>
        <Dialog.Content>
          <TouchableOpacity onPress={handleCopyPress}>
            <Subheading>Copy</Subheading>
          </TouchableOpacity>
          <View style={{margin: 8}}/>
          <TouchableOpacity onPress={handleReplyPress}>
            <Subheading>Reply</Subheading>
          </TouchableOpacity>
          <View style={{margin: 8}}/>
          <TouchableOpacity onPress={handleFowardPress}>
            <Subheading>Foward</Subheading>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog>
      <Toast ref={toastRef} position='center' />
    </Portal>
  )
}

ChatLongPressDialog.propTypes = { 
  visible: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired
}
ChatLongPressDialog.defaultProps = { message: {} , visible: false }
export default ChatLongPressDialog;