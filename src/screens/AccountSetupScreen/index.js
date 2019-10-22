import React from "react";
import firebase from "react-native-firebase";
import { StyleSheet } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { withCurrentUser } from "src/api/people/CurrentUser";
import Button from "src/components/Button";
import AppHeader from "src/components/AppHeader";
import HeadlineTitle from "src/components/HeadlineTitle";
import SetupListItem from "src/screens/AccountSetupScreen/SetupListItem";
import { View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Logger from "src/api/logger";
import { withTranslation } from 'react-i18next';
import { withTutorial } from "src/api/Tutorial";

function AccountSetupScreen(props){
  const { navigation, currentUser } = props;
  const [ isApplicationInformationComplete, setIsApplicationInformationComplete ] = React.useState(false);
  const [ isPersonalInformationComplete, setIsPersonalInformationComplete ] = React.useState(false);
  const [ canSubmit, setCanSubmit ] = React.useState(false);
  const [ isLoading, setLoading ] = React.useState(false);
  const [ applicationInformation, setApplicationInformation ] = React.useState(null);
  const [ personalInformation, setPersonalInformation ] = React.useState(null);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    titleContainer: { padding: 16, paddingTop: 8, paddingBottom: 8, backgroundColor: "white" },
    cardContainer:{ padding: 16, paddingBottom: 8, paddingTop: 8 }
  })

  const handlePersonalInformationPress = () => {
    const payload = {
      defaultGivenName: (personalInformation)?personalInformation.givenName:"",
      defaultFamilyName: (personalInformation)?personalInformation.familyName:"",
      defaultGender: (personalInformation)?personalInformation.gender:"male",
      onFinish: finishPersonalInformationSetup
    }
    navigation.navigate("PersonalInformationSetup", payload);
  }
  const handleApplicationInformationPress = () => {
    const payload = {
      defaultId: (applicationInformation)?applicationInformation.id:"",
      defaultNickName: (applicationInformation)?applicationInformation.nickName:"",
      onFinish: finishApplicationInformationSetup
    }
    navigation.navigate("ApplicationInformationSetup", payload);
  }

  const handleCompleteClick = async () => {
    setLoading(true)
    if(isApplicationInformationComplete && isPersonalInformationComplete){
      const db = firebase.firestore();
      await db.collection("users").doc(currentUser.email).update({
        personalInformation, applicationInformation, isCompleteSetup: true
      })
      navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [ NavigationActions.navigate({ routeName: 'Splash' }) ],
        })
      );
    }
    setLoading(false)
  };

  const finishApplicationInformationSetup = (data) => {
    if(data.nickName !== "" && data.id !== "") {
      setIsApplicationInformationComplete(true);
      setApplicationInformation(data);
    }
    Logger.log("AcountSetupScreen.finishApplicationInformationSetup#data", data);
  }

  const finishPersonalInformationSetup = (data) => {
    if(data.givenName !== "" && data.familyName !== "" && data.gender !== "") {
      setIsPersonalInformationComplete(true);
      setPersonalInformation(data);
    }
    Logger.log("AccountSetupScreen.finishPersonalInformationSetup#data", data);
  }

  React.useEffect(() => {
    Logger.log("AccountSetupScreen#isApplicationInformationComplete", isApplicationInformationComplete);
    Logger.log("AccountSetupScreen#isPersonalInformationComplete", isPersonalInformationComplete);
    props.resetTutorial()
    if(isApplicationInformationComplete && isPersonalInformationComplete) setCanSubmit(true);
    else setCanSubmit(false);
  }, [isApplicationInformationComplete, isPersonalInformationComplete])

  Logger.log("AccountSetupScreen#canSubmit", canSubmit);
  return(
    <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={styles.container}>
      <AppHeader style={{ backgroundColor: "transparent", elevation: 0 }}/>
      <HeadlineTitle style={{ marginHorizontal: 16 }}>{props.t("accountPrepare")}</HeadlineTitle>
      <SetupListItem 
        title={props.t("personalData")} subtitle={props.t("personalDataDesc")}
        onPress={handlePersonalInformationPress} isComplete={isPersonalInformationComplete}/>
      <SetupListItem 
        title={props.t("accountInfo")} subtitle={props.t("accountInfoDesc")} 
        onPress={handleApplicationInformationPress} isComplete={isApplicationInformationComplete}/>
      <View style={styles.cardContainer}>
        <Button text={props.t("perfect")} onPress={handleCompleteClick} isLoading={isLoading} disabled={!canSubmit}/>
      </View>
      
    </KeyboardAwareScrollView>
  )
}

AccountSetupScreen.navigationOptions = { header: null }
export default withTranslation()(withTutorial(withCurrentUser(AccountSetupScreen)))