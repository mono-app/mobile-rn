import React from "react";
import PeopleAPI from "src/api/people";
import NavigatorAPI from "src/api/navigator";
import { StyleSheet } from "react-native";
import { withTranslation } from 'react-i18next';
import { withTutorial } from "src/api/Tutorial";

import Button from "src/components/Button";
import AppHeader from "src/components/AppHeader";
import HeadlineTitle from "src/components/HeadlineTitle";
import SetupListItem from "src/screens/AccountSetupScreen/SetupListItem";
import CustomSnackbar from "src/components/CustomSnackbar";
import { View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function AccountSetupScreen(props){
  const { navigation } = props;
  const [ isApplicationInformationComplete, setIsApplicationInformationComplete ] = React.useState(false);
  const [ isPersonalInformationComplete, setIsPersonalInformationComplete ] = React.useState(false);
  const [ canSubmit, setCanSubmit ] = React.useState(false);
  const [ isLoading, setLoading ] = React.useState(false);
  const [ applicationInformation, setApplicationInformation ] = React.useState(null);
  const [ personalInformation, setPersonalInformation ] = React.useState(null);
  const [ errorMessage, setErrorMessage ] = React.useState(false);
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    titleContainer: { padding: 16, paddingTop: 8, paddingBottom: 8, backgroundColor: "white" },
    cardContainer:{ padding: 16, paddingBottom: 8, paddingTop: 8 }
  })

  const handleDismiss = () => setErrorMessage(null);
  const handlePersonalInformationPress = () => {
    const payload = {
      defaultGivenName: (personalInformation)? personalInformation.givenName: "",
      defaultFamilyName: (personalInformation)? personalInformation.familyName: "",
      defaultGender: (personalInformation)? personalInformation.gender: "male",
      onFinish: finishPersonalInformationSetup
    }
    navigation.navigate("PersonalInformationSetup", payload);
  }

  const handleApplicationInformationPress = () => {
    const payload = {
      defaultMonoId: (applicationInformation)? applicationInformation.monoId: "",
      defaultNickName: (applicationInformation)? applicationInformation.nickName: "",
      onFinish: finishApplicationInformationSetup
    }
    navigation.navigate("ApplicationInformationSetup", payload);
  }

  const handleCompleteClick = async () => {
    setLoading(true);
    try{
      const user = await PeopleAPI.getCurrentUser(true);
      await PeopleAPI.setupApplication(user, applicationInformation, personalInformation);
      const navigator = new NavigatorAPI(navigation);
      navigator.resetTo("Splash");
    }catch(err){
      setErrorMessage(err.message);
    }finally{ setLoading(false) }
  };

  const finishApplicationInformationSetup = (data) => {
    setIsApplicationInformationComplete(true);
    setApplicationInformation(data);
  }

  const finishPersonalInformationSetup = (personalInformation) => {
    setIsPersonalInformationComplete(true);
    setPersonalInformation(personalInformation);
  }

  React.useEffect(() => {
    props.resetTutorial();
    if(isApplicationInformationComplete && isPersonalInformationComplete) setCanSubmit(true);
    else setCanSubmit(false);
  }, [isApplicationInformationComplete, isPersonalInformationComplete])


  return(
    <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={styles.container}>
      <View style={{ flex: 1 }}>
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
        <CustomSnackbar isError={true} message={errorMessage} onDismiss={handleDismiss} />
      </View>
    </KeyboardAwareScrollView>
  )
}

AccountSetupScreen.navigationOptions = { header: null }
export default withTranslation()(withTutorial(AccountSetupScreen))