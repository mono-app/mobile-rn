import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationEvents, StackActions, NavigationActions } from "react-navigation";
import moment from "moment";
import SInfo from "react-native-sensitive-info";

import PeopleProfileHeader from "../../components/PeopleProfile/Header";
import PeopleInformationContainer from "../../components/PeopleProfile/InformationContainer";
import Button from "../../components/Button";

import PeopleAPI from "../../api/people";
import { PersonalRoomsAPI } from "../../api/rooms";

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
    api.getDetail(peopleEmail).then(people => {
      const { nickName, id } = people.applicationInformation;
      const { gender } = people.personalInformation;
      const { creationTime } = people;

      this.setState({ 
        nickName, creationTime, gender,
        status: null, monoId: id, 
      });
      this.props.navigation.setParams({ title: nickName })
    });
  }

  handleStartChattingPress = () => {
    const peopleEmail = this.props.navigation.getParam("peopleEmail");
    SInfo.getItem("currentUserEmail", {}).then(currentUserEmail => {
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
          status={this.state.status || "No Status"}/>
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