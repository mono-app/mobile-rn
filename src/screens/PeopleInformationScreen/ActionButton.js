import React from "react";
import { View } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";

import CurrentUserAPI from "src/api/people/CurrentUser";
import FriendsAPI from "src/api/friends";

const INITIAL_STATE = { isLoading: false };

export default class ActionButton extends React.PureComponent{

  handleStartChatPress = () => {}
  handleAddFriendPress = async () => {
    this.setState({ isLoading: true });
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    await new FriendsAPI().sendRequest(currentUserEmail, this.props.peopleEmail, this.props.source);
    if(this.props.onComplete) await this.props.onComplete();
    this.setState({ isLoading: false });
  }

  handleCancelRequestPress = async () => {
    this.setState({ isLoading: true });
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    await new FriendsAPI().cancelRequest(currentUserEmail, this.props.peopleEmail);
    if(this.props.onComplete) await this.props.onComplete();
    this.setState({ isLoading: false });
  }

  handleRejectRequestPress = async () => {
    this.setState({ isLoading: true });
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    await new FriendsAPI().rejectRequest(currentUserEmail, this.props.peopleEmail);
    if(this.props.onComplete) await this.props.onComplete();
    this.setState({ isLoading: false });
  }

  handleAcceptRequestPress = async () => {
    this.setState({ isLoading: true });
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    await new FriendsAPI().acceptRequest(currentUserEmail, this.props.peopleEmail, this.props.source);
    if(this.props.onComplete) await this.props.onComplete();
    this.setState({ isLoading: false });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleAddFriendPress = this.handleAddFriendPress.bind(this);
    this.handleCancelRequestPress = this.handleCancelRequestPress.bind(this);
    this.handleRejectRequestPress = this.handleRejectRequestPress.bind(this);
    this.handleAcceptRequestPress = this.handleAcceptRequestPress.bind(this);
    this.handleStartChatPress = this.handleStartChatPress.bind(this);
  }

  render(){
    const style = { marginHorizontal: 16 }
    const { peopleFriendStatus } = this.props;
    if(!peopleFriendStatus) return <Button loading={true} disabled={true} mode="contained" style={style}>Harap tunggu...</Button>
    if(peopleFriendStatus === "stranger"){
      return(
        <Button 
          mode="contained" style={style} 
          onPress={this.handleAddFriendPress} 
          loading={this.state.isLoading}
          disabled={this.state.isLoading}>
          Jadikan Teman
        </Button>
      )
    }else if(peopleFriendStatus === "requesting"){
      return (
        <Button 
          mode="contained" style={style} color="#EF6F6C" dark={true} 
          onPress={this.handleCancelRequestPress} 
          loading={this.state.isLoading}
          disabled={this.state.isLoading}>
          Batalkan Pertemanan
        </Button>
      )
    }else if(peopleFriendStatus === "friend"){
      return <Button mode="contained" style={style}>Mulai Percakapan</Button>
    }else if(peopleFriendStatus === "pendingAccept"){
      if(this.state.isLoading) return <Button loading={true} disabled={true} mode="contained" style={style}>Harap tunggu...</Button>
      else return (
        <View style={style}>
          <Button mode="contained" style={{ marginBottom: 16 }} onPress={this.handleAcceptRequestPress}>Terima Pertemanan</Button>
          <Button mode="contained" color="#EF6F6C" dark={true} onPress={this.handleRejectRequestPress}>Tolak Pertemanan</Button>
        </View>
      )
    }
  }
}

ActionButton.defaultProps = { peopleFriendStatus: null, peopleEmail: null }