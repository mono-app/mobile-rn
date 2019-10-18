import React from "react";
import FriendsAPI from "src/api/friends";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withNavigation } from "react-navigation";
import { PersonalRoomsAPI } from "src/api/rooms";
import Button from "src/components/Button";
import { View } from "react-native";

const INITIAL_STATE = { isLoading: false };

class ActionButton extends React.PureComponent{

  handleAddFriendPress = async () => {
    if(this._isMounted) this.setState({ isLoading: true });
    await new FriendsAPI().sendRequest(this.props.currentUser.email, this.props.peopleEmail, this.props.source);
    if(this.props.onComplete) await this.props.onComplete();
    if(this._isMounted) this.setState({ isLoading: false });
  }

  handleCancelRequestPress = async () => {
    if(this._isMounted) this.setState({ isLoading: true });
    await new FriendsAPI().cancelRequest(this.props.currentUser.email, this.props.peopleEmail);
    if(this.props.onComplete) await this.props.onComplete();
    if(this._isMounted) this.setState({ isLoading: false });
  }

  handleRejectRequestPress = async () => {
    if(this._isMounted) this.setState({ isLoading: true });
    await new FriendsAPI().rejectRequest(this.props.currentUser.email, this.props.peopleEmail);
    if(this.props.onComplete) await this.props.onComplete();
    if(this._isMounted) this.setState({ isLoading: false });
  }

  handleAcceptRequestPress = async () => {
    if(this._isMounted) this.setState({ isLoading: true });
    await new FriendsAPI().acceptRequest(this.props.currentUser.email, this.props.peopleEmail, this.props.source);
    if(this.props.onComplete) await this.props.onComplete();
    if(this._isMounted) this.setState({ isLoading: false });
  }

  handleBlockPress = async ()=> {
    if(this._isMounted) this.setState({ isLoading: true });
    await FriendsAPI.blockUsers(this.props.currentUser.email, this.props.peopleEmail)
    if(this.props.onComplete) await this.props.onComplete();
    if(this._isMounted) this.setState({ isLoading: false });
  }

  handleUnblockPress = async ()=> {
    if(this._isMounted) this.setState({ isLoading: true });
    await FriendsAPI.unblockUsers(this.props.currentUser.email, this.props.peopleEmail)
    if(this.props.onComplete) await this.props.onComplete();
    if(this._isMounted) this.setState({ isLoading: false });
  }

  handleHidePress = async ()=> {
    if(this._isMounted) this.setState({ isLoading: true });
    await FriendsAPI.hideUsers(this.props.currentUser.email, this.props.peopleEmail)
    if(this.props.onComplete) await this.props.onComplete();
    if(this._isMounted) this.setState({ isLoading: false });
  }

  handleUnhidePress = async ()=> {
    if(this._isMounted) this.setState({ isLoading: true });
    await FriendsAPI.unhideUsers(this.props.currentUser.email, this.props.peopleEmail)
    if(this.props.onComplete) await this.props.onComplete();
    if(this._isMounted) this.setState({ isLoading: false });
  }
  
  handleStartChatPress = async () => {
    const room = await PersonalRoomsAPI.createRoomIfNotExists(this.props.currentUser.email, this.props.peopleEmail,"chat");
    this.props.navigation.navigate({ routeName: "Chat", params: {room} })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this._isMounted = null
    this.handleAddFriendPress = this.handleAddFriendPress.bind(this);
    this.handleCancelRequestPress = this.handleCancelRequestPress.bind(this);
    this.handleRejectRequestPress = this.handleRejectRequestPress.bind(this);
    this.handleAcceptRequestPress = this.handleAcceptRequestPress.bind(this);
    this.handleBlockPress = this.handleBlockPress.bind(this);
    this.handleUnblockPress = this.handleUnblockPress.bind(this);
    this.handleHidePress = this.handleHidePress.bind(this);
    this.handleUnhidePress = this.handleUnhidePress.bind(this);
    this.handleStartChatPress = this.handleStartChatPress.bind(this);
  }
  
  componentDidMount(){ 
    this._isMounted = true
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }


  render(){
    const style = { marginHorizontal: 16,marginBottom:8 }
    const styleButtonRed = { backgroundColor: "#EF6F6C", borderColor: "#EF6F6C" }
    const { peopleFriendStatus } = this.props;
    if(!peopleFriendStatus || this.state.isLoading) return <Button style={style} isLoading disabled>Harap tunggu...</Button>

    const addFriendButton = <Button 
    style={style} text="Jadikan Teman"
    onPress={this.handleAddFriendPress} 
    isLoading={this.state.isLoading} disabled={this.state.isLoading}/>;

    const blockButton = <Button style={{...style, ...styleButtonRed}} onPress={this.handleBlockPress}  text="Block"/>;
    const unblockButton =  <Button style={{...style, ...styleButtonRed}} onPress={this.handleUnblockPress}  text="Unblock"/>
    const hideButton = <Button style={{...style, ...styleButtonRed}} onPress={this.handleHidePress} text="Hide"/>;
    const unhideButton =  <Button style={{...style, ...styleButtonRed}} onPress={this.handleUnhidePress} text="Unhide"/>;

    const cancelRequestButton = <Button 
    style={[ style, styleButtonRed ]}
    text="Batalkan Pertemanan" onPress={this.handleCancelRequestPress} 
    isLoading={this.state.isLoading} disabled={this.state.isLoading}/>;

    const acceptFriendButton = <Button style={{ ...style, marginBottom: 16 }} onPress={this.handleAcceptRequestPress} text="Terima Pertemanan"/>;
    const rejectFriendButton = <Button style={{...style, ...styleButtonRed,  marginBottom: 16}} onPress={this.handleRejectRequestPress} text="Tolak Pertemanan"/>;

    const startChatButton = <Button style={style} onPress={this.handleStartChatPress} outlined={true} text="Mulai Percakapan"/>

    if(peopleFriendStatus === "myself"){
      return null
    }else if(peopleFriendStatus === "stranger"){
      return(
        <View>
          {addFriendButton}
          {blockButton}
          {startChatButton}
        </View>
      )
    }else if(peopleFriendStatus === "requesting"){
      return (
        <View>
        {cancelRequestButton}
        {startChatButton}
        </View>
      )
    }else if(peopleFriendStatus === "friend"){
      return (
        <View>
          {blockButton}
          {hideButton}
          {startChatButton}
        </View>
      )
    }else if(peopleFriendStatus === "pendingAccept"){
      if(this.state.isLoading) return <Button style={style} text="Harap tunggu..." isLoading disabled/>
      else return (
        <View>
          {acceptFriendButton}
          {rejectFriendButton}
          {startChatButton}
        </View>
      )
    }else if(peopleFriendStatus === "blocked"){
      return (      
       unblockButton
      )
    }else if(peopleFriendStatus === "hide"){
      return (
        <View>
          {unhideButton}
          {startChatButton}
        </View>
      )
    }
  }
}

ActionButton.defaultProps = { peopleFriendStatus: null, peopleEmail: null }
export default withNavigation(withCurrentUser(ActionButton));