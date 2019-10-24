import React from "react";
import moment from "moment";
import Logger from "src/api/logger";
import FriendsAPI from "src/api/friends";
import PeopleAPI from "src/api/people";
import StatusAPI from "src/api/status";
import { withCurrentUser } from "src/api/people/CurrentUser";
import UserProfileHeader from "src/components/UserProfileHeader";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import ActionButton from "src/screens/PeopleInformationScreen/ActionButton";
import AppHeader from "src/components/AppHeader";
import { View, ScrollView } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption } from "react-native-paper";
import { withTranslation } from 'react-i18next';

function PeopleInformationScreen(props){
  const { currentUser } = props;

  const _isMounted = React.useRef(true);
  const [ isLoadingProfile, setIsLoadingProfile ] = React.useState(true);
  const [ people, setPeople ] = React.useState(null);
  const [ peopleFriendStatus, setPeopleFriendStatus ] = React.useState(null);
  const [ status, setStatus ] = React.useState("");
  const [ joinedFrom, setJoinedFrom ] = React.useState("");
  
  const peopleEmail = props.navigation.getParam("peopleEmail", null);
  const source = props.navigation.getParam("source", { value: "" });

  const handleActionButtonComplete = () => fetchPeopleFriendStatus();
  const fetchPeopleInformation = async () => {
    if(_isMounted.current) setIsLoadingProfile(true);
    const peopleData = await PeopleAPI.getDetail(peopleEmail);
    const status = await StatusAPI.getLatestStatus(peopleEmail);
    Logger.log("PeopleInformationScreen.fetchPeopleInformation", peopleData)
    if(status && _isMounted.current) setStatus(status.content);
    if(_isMounted.current) setPeople(peopleData);
    if(_isMounted.current) setJoinedFrom(moment(peopleData.creationTime.seconds * 1000).format("DD MMMM YYYY"));
    if(_isMounted.current) setIsLoadingProfile(false);
  }

  const fetchPeopleFriendStatus = async () => {
    const peopleFriendStatus = await new FriendsAPI().getFriendStatus(currentUser.email, peopleEmail);
    if(currentUser.email!==peopleEmail){
      if(_isMounted.current) setPeopleFriendStatus(peopleFriendStatus);
    }else{
      if(_isMounted.current) setPeopleFriendStatus("myself");
    }
  }
  
  React.useEffect(() => {
    fetchPeopleInformation();
    fetchPeopleFriendStatus();
    return () => {
      _isMounted.current = false
    }
  }, [])

  if(isLoadingProfile){
    return (
      <Dialog visible={true}>
        <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <ActivityIndicator/>
          <View>
            <Text>{props.t("loadData")}</Text>
            <Caption>{props.t("pleaseWait")}</Caption>
          </View>
        </Dialog.Content>
      </Dialog>
    )
  }else return (
    <ScrollView style={{ flex: 1 }}>
      <AppHeader navigation={props.navigation} style={{ backgroundColor: "transparent" }}/>
      <UserProfileHeader
        style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}
        profilePicture={people.profilePicture}
        title={people.applicationInformation.nickName}
        subtitle={status}/>
      <View style={{ marginTop: 16, marginBottom: 16 }}>
        <PeopleInformationContainer fieldName="Mono ID" fieldValue={people.applicationInformation.id}/>
        <PeopleInformationContainer fieldName={props.t("source")} fieldValue={source.value}/>
        <PeopleInformationContainer fieldName={props.t("joinDate")} fieldValue={joinedFrom}/>
      </View>
      <ActionButton 
        peopleEmail={peopleEmail} source={source}
        peopleFriendStatus={peopleFriendStatus} 
        onComplete={handleActionButtonComplete}/>
    </ScrollView>
  )
}

PeopleInformationScreen.navigationOptions = { header: null };
export default withTranslation()(withCurrentUser(PeopleInformationScreen))