import React from "react";
import FriendsAPI from "src/api/friends";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";
import { StackActions } from "react-navigation";
import { PersonalRoomsAPI } from "src/api/rooms";

import Button from "src/components/Button";
import { View } from "react-native";

const INITIAL_STATE = { isLoading: false };

class ActionButton extends React.PureComponent{

  handleStartChatPress = async () => {
    this.setState({ isLoading: true });
    const roomId = await PersonalRoomsAPI.createRoomIfNotExists(this.props.currentUser.email, this.props.peopleEmail);
    this.setState({ isLoading: false });
    if(roomId) this.props.navigation.dispatch(StackActions.replace({ routeName: "Chat", params: {roomId, peopleEmail: this.props.peopleEmail} }));
  }

  handleAddFriendPress = async () => {
    this.setState({ isLoading: true });
    await new FriendsAPI().sendRequest(this.props.currentUser.email, this.props.peopleEmail, this.props.source);
    if(this.props.onComplete) await this.props.onComplete();
    this.setState({ isLoading: false });
  }

  handleCancelRequestPress = async () => {
    this.setState({ isLoading: true });
    await new FriendsAPI().cancelRequest(this.props.currentUser.email, this.props.peopleEmail);
    if(this.props.onComplete) await this.props.onComplete();
    this.setState({ isLoading: false });
  }

  handleRejectRequestPress = async () => {
    this.setState({ isLoading: true });
    await new FriendsAPI().rejectRequest(this.props.currentUser.email, this.props.peopleEmail);
    if(this.props.onComplete) await this.props.onComplete();
    this.setState({ isLoading: false });
  }

  handleAcceptRequestPress = async () => {
    this.setState({ isLoading: true });
    await new FriendsAPI().acceptRequest(this.props.currentUser.email, this.props.peopleEmail, this.props.source);
    if(this.props.onComplete) await this.props.onComplete();
    this.setState({ isLoading: false });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleStartChatPress = this.handleStartChatPress.bind(this);
    this.handleAddFriendPress = this.handleAddFriendPress.bind(this);
    this.handleCancelRequestPress = this.handleCancelRequestPress.bind(this);
    this.handleRejectRequestPress = this.handleRejectRequestPress.bind(this);
    this.handleAcceptRequestPress = this.handleAcceptRequestPress.bind(this);
    this.handleStartChatPress = this.handleStartChatPress.bind(this);
  }

  render(){
    const style = { marginHorizontal: 16 }
    const { peopleFriendStatus } = this.props;
    if(!peopleFriendStatus || this.state.isLoading) return <Button style={style} isLoading disabled>Harap tunggu...</Button>
    if(peopleFriendStatus === "stranger"){
      return(
        <Button 
          style={style} text="Jadikan Teman"
          onPress={this.handleAddFriendPress} 
          isLoading={this.state.isLoading} disabled={this.state.isLoading}/>
      )
    }else if(peopleFriendStatus === "requesting"){
      return (
        <Button 
          style={[ style, {backgroundColor: "#EF6F6C"} ]}
          text="Batalkan Pertemanan" onPress={this.handleCancelRequestPress} 
          isLoading={this.state.isLoading} disabled={this.state.isLoading}/>
      )
    }else if(peopleFriendStatus === "friend"){
      return <Button style={style} onPress={this.handleStartChatPress} text="Mulai Percakapan"/>
    }else if(peopleFriendStatus === "pendingAccept"){
      if(this.state.isLoading) return <Button style={style} text="Harap tunggu..." isLoading disabled/>
      else return (
        <View style={style}>
          <Button style={{ marginBottom: 16 }} onPress={this.handleAcceptRequestPress} text="Terima Pertemanan"/>
          <Button style={{ backgroundColor: "#EF6F6C" }} onPress={this.handleRejectRequestPress} text="Tolak Pertemanan"/>
        </View>
      )
    }
  }
}

ActionButton.defaultProps = { peopleFriendStatus: null, peopleEmail: null }
export default withNavigation(withCurrentUser(ActionButton));