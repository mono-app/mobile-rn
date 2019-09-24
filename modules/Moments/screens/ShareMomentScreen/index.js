import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import ShareMomentListItem from "modules/Moments/components/ShareMomentListItem";
import AppHeader from "src/components/AppHeader";
import FriendsAPI from "src/api/friends";
import Button from "src/components/Button";
import { withCurrentUser } from "src/api/people/CurrentUser"
import { PersonalRoomsAPI } from "src/api/rooms";
import MessagesAPI from "src/api/messages";
import { Text } from "react-native-paper";

const INITIAL_STATE = { isLoading: true, isShareLoading: false , peopleList:[], filteredPeopleList:[] };

class ShareMomentScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Bagikan ke"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadFriends = async () => {
    if(this._isMounted)
      this.setState({ peopleList: [] });
    const peopleList = await FriendsAPI.getFriends(this.props.currentUser.email);
    const peopleListWithoutMe = await peopleList.filter((people) => {
        return people.email !== this.props.currentUser.email
      })
    if(this._isMounted)
      this.setState({ peopleList: peopleListWithoutMe, filteredPeopleList: peopleListWithoutMe });
  }

  handleSearchPress = (searchText) => {
    this.setState({filteredPeopleList: []})

    const clonedPeopleList = JSON.parse(JSON.stringify(this.state.peopleList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){

      const filteredPeopleList = clonedPeopleList.filter((people) => {

        return people.applicationInformation.nickName.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0
      })
      this.setState({filteredPeopleList})
    } else {
      this.setState({filteredPeopleList: clonedPeopleList})
    }
  }

  handleFriendPress = people => {
    const clonedFilteredPeopleList = JSON.parse(JSON.stringify(this.state.filteredPeopleList)) 
    const clonedPeopleList = JSON.parse(JSON.stringify(this.state.peopleList)) 
    this.setState({filteredPeopleList: [], peopleList: []})

    const filteredPeopleList = clonedFilteredPeopleList.map((data) => {
      if(data.email==people.email){
        if(people.checked){
          return {...data, checked: false}
        }else{
          return {...data, checked: true}
        }
      }
      return {...data}
    })
    const peopleList = clonedPeopleList.map((data) => {
      if(data.email==people.email){
        if(people.checked){
          return {...data, checked: false}
        }else{
          return {...data, checked: true}
        }
      }
      return {...data}
    })
    this.setState({filteredPeopleList, peopleList})
  }

  handleSharePress = async () => {
    this.setState({isShareLoading: true})
    const clonedPeopleList = JSON.parse(JSON.stringify(this.state.peopleList))
    for(let i=0;i<clonedPeopleList.length;i++){
      if(clonedPeopleList[i].checked){
        const peopleEmail = clonedPeopleList[i].email
        const message = "Share Moment, \nTitle: "+this.moment.content.message
        const room = await PersonalRoomsAPI.createRoomIfNotExists(this.props.currentUser.email, peopleEmail);
    
        MessagesAPI.sendMessage(room.id, this.props.currentUser.email, message, "moment-share", {moment: {...this.moment}});
      }
    }

    this.setState({isShareLoading:false})
    const {navigation} = this.props
    navigation.state.params.onComplete()
    navigation.goBack()
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null;
    this.moment = this.props.navigation.getParam("moment", {});
    this.loadFriends = this.loadFriends.bind(this);
    this.handleFriendPress = this.handleFriendPress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.handleSharePress = this.handleSharePress.bind(this);
  }

  componentDidMount(){
    this._isMounted = true;

    this.loadFriends();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={{ padding: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder="Cari Teman" />
        </View>
        {(this.state.peopleList.length==0)?<Text style={{backgroundColor:"#fff", padding:16, textAlign:"center"}}>Kamu tidak memiliki teman</Text>:<View/>}
        
        <FlatList
          style={{ backgroundColor: "white" }}
          data={this.state.filteredPeopleList}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => {
            return (
              <ShareMomentListItem 
                onPress={() => this.handleFriendPress(item)}
                user={item}/>
            )
          }}
        />
        <View style={{ backgroundColor: "#fff" }}>
          <Button
            text="Bagikan"
            isLoading={this.state.isShareLoading}
            style={{marginHorizontal: 16}}
            onPress={this.handleSharePress}
          />      
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
export default withCurrentUser(ShareMomentScreen)
