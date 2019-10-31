import React from "react";
import { Clipboard, TouchableOpacity, View } from "react-native";
import { Dialog, Portal, Subheading } from "react-native-paper";
import Toast from 'react-native-easy-toast'
import PropTypes from "prop-types";
import FriendsAPI from "src/api/friends";
import firebase from 'react-native-firebase';

function HideBlockContactDialog(props){
  const { visible, people } = props
  const toastRef = React.useRef(null);
  const firebaseCurrentUser = firebase.auth().currentUser

  const handleHidePress = () => {
    FriendsAPI.hideUsers(firebaseCurrentUser.uid, people.id)
    props.onDismiss()
  }

  const handleBlockPress = () => {
    FriendsAPI.blockUsers(firebaseCurrentUser.uid, people.id)
    props.onDismiss()
  }

  return (
    <Portal>
      <Dialog
          visible={visible}
          onDismiss={props.onDismiss}>
        <Dialog.Content>
          <TouchableOpacity onPress={handleHidePress}>
            <Subheading>Hide</Subheading>
          </TouchableOpacity>
          <View style={{margin: 8}}/>
          <TouchableOpacity onPress={handleBlockPress}>
            <Subheading>Block</Subheading>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog>
      <Toast ref={toastRef} position='center' />
    </Portal>
  )
}

HideBlockContactDialog.propTypes = { 
  visible: PropTypes.object.isRequired,
}
HideBlockContactDialog.defaultProps = { message: {} , visible: false }
export default HideBlockContactDialog;