import React from "react";
import { withNavigation, StackActions, NavigationActions} from "react-navigation";
import { withCurrentUser } from "src/api/people/CurrentUser";
import PeopleAPI from "src/api/people"
import { Dialog, Portal, Paragraph, Button } from "react-native-paper";
import firebase from "react-native-firebase";
import { withTranslation } from 'react-i18next';

function SignOutDialog(props){
  const handleSignOutPress = async () => {
    const result = await PeopleAPI.updateUserForLogout(props.currentUser.id)
    if(result){
      const firebaseUser = firebase.auth().currentUser;
      await PeopleAPI.setOnlineStatus(firebaseUser.uid, "Offline");
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
        <Dialog.Title>{props.t("attention")}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{props.t("logoutAsk")}</Paragraph>
          <Paragraph>{props.t("logoutDesc")}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button color="#5E8864" onPress={props.onCancel}>{props.t("cancel")}</Button>
          <Button color="#EF6F6C" onPress={handleSignOutPress}>{props.t("logout")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default withTranslation()(withCurrentUser(withNavigation(SignOutDialog)))