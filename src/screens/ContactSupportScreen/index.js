import React from "react";
import Button from "src/components/Button";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card, Subheading } from "react-native-paper";
import TextInput from "src/components/TextInput";
import CustomSnackbar from "src/components/CustomSnackbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { withTranslation } from 'react-i18next';
import PeopleAPI from "src/api/people";
import firebase from "react-native-firebase";
import ContactSupportMessage from "src/entities/contactSupportMessage";
import ContactSupportAPI from "src/api/contactSupport";
import AppHeader from "src/components/AppHeader";
import HeadlineTitle from "src/components/HeadlineTitle";

function ContactSupportScreen(props){
  const { currentUser } = props;
  const firebaseCurrentUser = firebase.auth().currentUser
  const [ monoId, setMonoId ] = React.useState("")
  const [ email, setEmail ] = React.useState(props.navigation.getParam("email", ""))
  const [ name, setName ] = React.useState(props.navigation.getParam("name", ""))
  const [ description, setDescription ] = React.useState(props.navigation.getParam("description", ""))
  const [ isError, setIsError ] = React.useState(false)
  const [ isLoading, setIsLoading ] = React.useState(false)
  const [ snackbarMessage, setSnackbarMessage ] = React.useState(null)
  
  const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    label: { fontSize: 14, color: "#000000" }
  });

  const handleEmailChange = (value) => setEmail(value)
  const handleNameChange = (value) => setName(value)
  const handleDescriptionChange = (value) => setDescription(value)
  const handleDismissSnackBar = () => setSnackbarMessage(null)
  const handleError = (message) => {
    setIsError(true)
    setSnackbarMessage(message)
  }

  const handleSendPress = async () => {
    setIsLoading(true)
    try{
      const contactSupportMessage = new ContactSupportMessage(monoId, email, name, description)
      await ContactSupportAPI.sendContactSupportMessage(contactSupportMessage)
      setIsError(false)
      setSnackbarMessage(props.t("success"))
      setName(null)
      setDescription(null)
      setEmail(null)
    }catch(err){
      handleError(err.message)
    }finally{
      setIsLoading(false)
    }
  }

  const init = async () => {
    const user = await PeopleAPI.getDetailById(firebaseCurrentUser.uid, true)
    setMonoId(user.applicationInformation.monoId)
  }

  React.useEffect(() => {
    init()
  })
  
  return(
    <View style={{flex:1, backgroundColor: "#fff"}}>
        <AppHeader style={{ backgroundColor: "transparent" }} navigation={props.navigation}/>
        <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Contact Support</HeadlineTitle>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{flex:1}}>
            <View style={styles.container}>
              <View style={{ marginTop: 16, flexDirection:"row" }}>
                <Title style={styles.label}>Your Mono ID</Title>
                <Text style={{ marginLeft: 8, alignSelf:"center" }}>{monoId}</Text>
              </View>
              <View style={{ marginTop: 16 }}>
                <Title style={styles.label}>Email</Title>
                <TextInput
                  style={{ marginBottom: 0 }}
                  placeholder={props.t("example")+": johndoe@gmail.com"}
                  value={email}
                  onChangeText={handleEmailChange}
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <Title style={styles.label}>Name</Title>
                <TextInput
                  style={{ marginBottom: 0 }}
                  placeholder={props.t("example")+": John Doe"}
                  value={name}
                  onChangeText={handleNameChange}
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <Title style={styles.label}>Description</Title>
                <TextInput
                  style={{ marginBottom: 0,  textAlignVertical: "top", maxHeight: 80 }}
                  value={description}
                  multiline={true}
                  numberOfLines = {5}
                  onChangeText={handleDescriptionChange}
                />
              </View>
              <View style={{ paddingVertical: 8 }} />
              <Button
                text={"Send"}
                isLoading={isLoading}
                disabled={isLoading}
                onPress={handleSendPress}
              />
            </View>
        </KeyboardAwareScrollView>
        <CustomSnackbar isError={isError} message={snackbarMessage} onDismiss={handleDismissSnackBar} />
      </View>
  )
}

ContactSupportScreen.navigationOptions = { header: null }
export default withTranslation()(ContactSupportScreen)