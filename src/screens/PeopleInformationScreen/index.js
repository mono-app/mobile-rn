import React from "react";
import moment from "moment";
import { View } from "react-native";
import { ActivityIndicator, Dialog, Text, Caption } from "react-native-paper";

import FriendsAPI from "src/api/friends";
import PeopleAPI from "src/api/people";
import CurrentUserAPI from "src/api/people/CurrentUser";

import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import ActionButton from "src/screens/PeopleInformationScreen/ActionButton";

const INITIAL_STATE = { isLoadingProfile: true, people: null, peopleFriendStatus: null }

/**
 * Parameter list
 * 
 * @param {string} peopleId
 */
export default class PeopleInformationScreen extends React.PureComponent {
  loadPeopleInformation = async () => {
    this.setState({ isLoadingProfile: true });
    const promises = [ new PeopleAPI().getDetail(this.peopleEmail), new PeopleAPI().getLatestStatus(this.peopleEmail) ];
    const results = await Promise.all(promises);

    const status = results[1]? results[1].content: "No Status";
    const peopleData = results[0];
    this.setState({ isLoadingProfile: false, people: {
      source: this.source, profilePicture: peopleData.applicationInformation.profilePicture,
      joinedFrom: moment.unix(parseInt(peopleData.creationTime) / 1000).format("DD MMMM YYYY"),
      nickName: peopleData.applicationInformation.nickName, status
    }})
  }

  loadPeopleFriendStatus = async () => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const peopleFriendStatus = await new FriendsAPI().getFriendStatus(currentUserEmail, this.peopleEmail);
    this.setState({ peopleFriendStatus });
  }

  handleActionButtonComplete = () => this.loadPeopleFriendStatus();
  
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.peopleEmail = this.props.navigation.getParam("peopleEmail", null);
    this.source = this.props.navigation.getParam("source", null);
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.loadPeopleFriendStatus = this.loadPeopleFriendStatus.bind(this);
    this.handleActionButtonComplete = this.handleActionButtonComplete.bind(this);
  }

  componentDidMount(){ 
    this.loadPeopleInformation(); 
    this.loadPeopleFriendStatus();
  }

  render(){
    console.log(this.state);
    if(this.state.isLoadingProfile){
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
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <PeopleProfileHeader
          profilePicture={this.state.people.profilePicture}
          nickName={this.state.people.nickName}
          status={this.state.people.status}/>
        <View style={{ marginTop: 16, marginBottom: 16 }}>
          <PeopleInformationContainer
            fieldName="Sumber"
            fieldValue={this.state.people.source.value}/>
          <PeopleInformationContainer
            fieldName="Bergabung Sejak"
            fieldValue={moment(this.state.people.joinedFrom).format("DD MMMM YYYY")}/>
        </View>
        <ActionButton 
          peopleEmail={this.peopleEmail}
          source={this.source}
          peopleFriendStatus={this.state.peopleFriendStatus}
          onComplete={this.handleActionButtonComplete}/>
      </View>
    )
  }
}
