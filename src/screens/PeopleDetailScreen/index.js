import React from "react";
import moment from "moment";
import { View, StyleSheet } from "react-native";
import { NavigationEvents, StackActions, NavigationActions } from "react-navigation";

import PeopleAPI from "src/api/people";
import { PersonalRoomsAPI } from "src/api/rooms";

import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import Button from "src/components/Button";

const INITIAL_STATE = { creationTime: null, nickName: "", status: "", monoId: "" }

export default class PeopleDetailScreen extends React.Component{
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return { headerTitle: state.params.title }
  }

  goToChatScreen = roomId => {
    const peopleName = this.state.nickName;
    this.props.navigation.dispatch(StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "ContactHome" }),
        NavigationActions.navigate({ routeName: "Chat", params: { peopleName, roomId } })
      ]
    }))
  }

  handleScreenWillFocus = () => {
    const peopleEmail = this.props.navigation.getParam("peopleEmail");
    const api = new PeopleAPI();
    const promises = [ api.getDetail(peopleEmail), api.getLatestStatus(peopleEmail) ];
    Promise.all(promises).then(results => {
      const people = results[0];
      const status = results[1]? results[1].content: "";
      const { nickName, id, profilePicture } = people.applicationInformation;
      const { gender } = people.personalInformation;
      const { creationTime } = people;
      this.setState({ profilePicture, nickName, creationTime, gender, status, monoId: id });
      this.props.navigation.setParams({ title: nickName })
    })
  }

  handleStartChattingPress = () => {
    const peopleEmail = this.props.navigation.getParam("peopleEmail");
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const audiences = [ peopleEmail, currentUserEmail ];
      const personalRoomAPI = new PersonalRoomsAPI();
      return personalRoomAPI.createRoomIfNotExists(audiences);
    }).then(roomId => {
      this.goToChatScreen(roomId);
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.goToChatScreen = this.goToChatScreen.bind(this);
    this.handleScreenWillFocus = this.handleScreenWillFocus.bind(this);
    this.handleStartChattingPress = this.handleStartChattingPress.bind(this);
  }

  render(){
    let joinedDateString = "";
    let genderString = "";

    if(this.state.creationTime) joinedDateString =  moment(this.state.creationTime).format("DD MMMM YYYY");
    if(this.state.gender) genderString = (this.state.gender === "male")? "Laki-Laki": "Perempuan";

    return(
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.handleScreenWillFocus}/>

        <PeopleProfileHeader 
          nickName={this.state.nickName}
          status={this.state.status || "No Status" }
          profilePicture={this.state.profilePicture}/>
        <View style={{ marginTop: 16, marginBottom: 16 }}>
          <PeopleInformationContainer fieldName="Jenis Kelamin" fieldValue={genderString}/>
          <PeopleInformationContainer fieldName="Mono ID" fieldValue={this.state.monoId}/>
          <PeopleInformationContainer fieldName="Bergabung Sejak" fieldValue={joinedDateString}/>
        </View>

        <View style={{ paddingLeft: 16, paddingRight: 16 }}>
          <Button text="Mulai Percakapan" onPress={this.handleStartChattingPress}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8EEE8",
    display: "flex",
    flexGrow: 1
  }
})