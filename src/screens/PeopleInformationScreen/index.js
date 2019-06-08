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
import CancelledFriendRequestDialog from "src/screens/PeopleInformationScreen/CancelledFriendRequestDialog";
import AddedFriendRequestDialog from "src/screens/PeopleInformationScreen/AddedFriendRequestDialog";

// const INITIAL_STATE = { 
//   isLoadingProfile: true,
//   isAdding: false,
//   isCancelling: false,
//   isAdded: null,
//   isRequested: null,
//   isInFriendList: null, 
//   people: { 
//     nickName: "", 
//     joinedFrom: "",
//     status: "",
//     source: { id: "", value: "" } 
//   }
// }

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
  handleCancelFriendRequestPress = () => {
    this.setState({ isCancelling: true });
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const peopleId = this.props.navigation.getParam("peopleId", "test.kedua@gmail.com");
      const api = new FriendsAPI();
      return api.cancelRequest(currentUserEmail, peopleId);
    }).then(success => {
      if(!success) throw "Terjadi kesalahan. Silahkan coba lagi.";
      this.setState({ isCancelling: false, isCancelled: true });
    }).catch(err => {
      console.log(err);
      alert(err);
    })
  }
  
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.peopleEmail = this.props.navigation.getParam("peopleEmail", null);
    this.source = this.props.navigation.getParam("source", null);
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.loadPeopleFriendStatus = this.loadPeopleFriendStatus.bind(this);
    this.handleCancelFriendRequestPress = this.handleCancelFriendRequestPress.bind(this);
    this.handleActionButtonComplete = this.handleActionButtonComplete.bind(this);
  }

  componentDidMount(){ 
    this.loadPeopleInformation(); 
    this.loadPeopleFriendStatus();
  }

  render(){
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
        <AddedFriendRequestDialog {...this.props} visible={this.state.isAdded}/>
        <CancelledFriendRequestDialog {...this.props} visible={this.state.isCancelled}/>

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
          peopleFriendStatus={this.state.peopleFriendStatus}
          onComplete={this.handleActionButtonComplete}/>
      </View>
    )
  }
}
