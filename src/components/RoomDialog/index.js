import React from "react";
import { Clipboard, TouchableOpacity, View } from "react-native";
import { Dialog, Portal, Subheading } from "react-native-paper";
import Toast from 'react-native-easy-toast'
import PropTypes from "prop-types";
import RoomsAPI from "src/api/rooms";
import firebase from 'react-native-firebase';

function RoomDialog(props){
  const { visible, selectedRoom } = props
  const toastRef = React.useRef(null);
  const firebaseCurrentUser = firebase.auth().currentUser

  const handleMutePress = () => {
    if(selectedRoom.mutedBy && selectedRoom.mutedBy.includes(firebaseCurrentUser.uid)) RoomsAPI.unmutedRoom(selectedRoom.id, firebaseCurrentUser.uid)
    else RoomsAPI.mutedRoom(selectedRoom.id, firebaseCurrentUser.uid)
    props.onDismiss()
  }

  const handleHidePress = () => {
    RoomsAPI.hideRoom(selectedRoom.id, firebaseCurrentUser.uid)
    props.onDismiss()
  }

  const handleDeletePress = () => {
    RoomsAPI.hideRoom(selectedRoom.id, firebaseCurrentUser.uid)
    props.onDismiss()
  }

  return (
    <Portal>
      <Dialog
          visible={visible}
          onDismiss={props.onDismiss}>
        <Dialog.Content>
          <TouchableOpacity onPress={handleMutePress}>
            <Subheading>{selectedRoom.mutedBy && selectedRoom.mutedBy.includes(firebaseCurrentUser.uid)?"Unmute" : "Mute"}</Subheading>
          </TouchableOpacity>
          <View style={{margin: 8}}/>
          <TouchableOpacity onPress={handleHidePress}>
            <Subheading>Hide</Subheading>
          </TouchableOpacity>
          <View style={{margin: 8}}/>
          <TouchableOpacity onPress={handleDeletePress}>
            <Subheading>Delete</Subheading>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog>
      <Toast ref={toastRef} position='center' />
    </Portal>
  )
}

RoomDialog.propTypes = { 
  visible: PropTypes.bool.isRequired,
  selectedRoom: PropTypes.object.isRequired
}
RoomDialog.defaultProps = { selectedRoom: {} , visible: false }
export default RoomDialog;