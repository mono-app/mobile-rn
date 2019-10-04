import React from "react";
import { withNavigation, StackActions, NavigationActions} from "react-navigation";
import { withCurrentUser } from "src/api/people/CurrentUser";

import { Dialog, Portal, Paragraph, Button } from "react-native-paper";
import firebase from "react-native-firebase";

function SignOutDialog(props){
  const handleSignOutPress = async () => {
    const result = await PeopleAPI.updateUserForLogout(props.currentUser.email)
    if(result){
      firebase.auth().signOut();
      props.navigation.dispatch(StackActions.reset({
        index: 0, actions: [ NavigationActions.navigate({ routeName: "Splash" }) ],
        key: null
      }))
    }
  }

  return(
    <Portal>
      <Dialog visible={props.show}>
        <Dialog.Title>Perhatian</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Apakah Anda yakin ingin keluar dari aplikasi ini?</Paragraph>
          <Paragraph>Anda harus masuk lagi ke aplikasi ini untuk tetap dapat menerima pesan.</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button color="#5E8864" onPress={props.onCancel}>Batal</Button>
          <Button color="#EF6F6C" onPress={handleSignOutPress}>Keluar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default 
withCurrentUser(
  withNavigation(
    SignOutDialog
  )
);