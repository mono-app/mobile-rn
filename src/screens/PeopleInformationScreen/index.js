import React from "react";
import moment from "moment";
import Logger from "src/api/logger";
import FriendsAPI from "src/api/friends";
import PeopleAPI from "src/api/people";
import StatusAPI from "src/api/status";
import { withCurrentUser } from "src/api/people/CurrentUser";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import ActionButton from "src/screens/PeopleInformationScreen/ActionButton";
import AppHeader from "src/components/AppHeader";
import { View } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption } from "react-native-paper";
import Button from "src/components/Button";
import { PersonalRoomsAPI } from "src/api/rooms";
import { StackActions } from "react-navigation";

function PeopleInformationScreen(props){
  const { currentUser } = props;

  const [ isLoadingProfile, setIsLoadingProfile ] = React.useState(true);
  const [ people, setPeople ] = React.useState(null);
  const [ peopleFriendStatus, setPeopleFriendStatus ] = React.useState(null);
  const [ status, setStatus ] = React.useState("");
  const [ joinedFrom, setJoinedFrom ] = React.useState("");
  
  const peopleEmail = props.navigation.getParam("peopleEmail", null);
  const source = props.navigation.getParam("source", { value: "" });

  const handleActionButtonComplete = () => fetchPeopleFriendStatus();
  const fetchPeopleInformation = async () => {
    setIsLoadingProfile(true);
    const peopleData = await PeopleAPI.getDetail(peopleEmail);
    const status = await StatusAPI.getLatestStatus(peopleEmail);
    Logger.log("PeopleInformationScreen.fetchPeopleInformation", peopleData)
    if(status) setStatus(status.content);

    setPeople(peopleData);
    setJoinedFrom(moment(peopleData.creationTime.seconds * 1000).format("DD MMMM YYYY"));
    setIsLoadingProfile(false);
  }

  const fetchPeopleFriendStatus = async () => {
    const peopleFriendStatus = await new FriendsAPI().getFriendStatus(currentUser.email, peopleEmail);
    if(currentUser.email!==peopleEmail){
      setPeopleFriendStatus(peopleFriendStatus);
    }else{
      setPeopleFriendStatus("myself");
    }
  }



  React.useEffect(() => {
    fetchPeopleInformation();
    fetchPeopleFriendStatus();
  }, [])

  if(isLoadingProfile){
    return (
      <Dialog visible={true}>
        <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <ActivityIndicator/>
          <View>
            <Text>Sedang memuat data</Text>
            <Caption>Harap tunggu...</Caption>
          </View>
        </Dialog.Content>
      </Dialog>
    )
  }else return (
    <View style={{ flex: 1 }}>
      <AppHeader navigation={props.navigation} style={{ backgroundColor: "transparent" }}/>
      <PeopleProfileHeader
        style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}
        profilePicture={people.profilePicture}
        title={people.applicationInformation.nickName}
        subtitle={status}/>
      <View style={{ marginTop: 16, marginBottom: 16 }}>
      <PeopleInformationContainer fieldName="Mono ID" fieldValue={people.applicationInformation.id}/>
      <PeopleInformationContainer fieldName="Sumber" fieldValue={source.value}/>
      <PeopleInformationContainer fieldName="Bergabung Sejak" fieldValue={joinedFrom}/>
      </View>
      <ActionButton 
        peopleEmail={peopleEmail} source={source}
        peopleFriendStatus={peopleFriendStatus} 
        onComplete={handleActionButtonComplete}/>
    </View>
  )
}
PeopleInformationScreen.navigationOptions = { header: null };
export default withCurrentUser(PeopleInformationScreen);