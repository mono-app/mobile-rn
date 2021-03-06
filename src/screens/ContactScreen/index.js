import React from "react";
import FriendsAPI from "src/api/friends";
import { withCurrentUser } from "src/api/people/CurrentUser";
import firebase from 'react-native-firebase';

import PeopleListItem from "src/components/PeopleListItem";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import { withTranslation } from 'react-i18next';
import HideBlockContactDialog from "src/components/HideBlockContactDialog"

function ContactScreen(props){
  const { blockedUserList,blockedByUserList,hiddenUserList } = props;
  const firebaseCurrentUser = firebase.auth().currentUser

  const [ peopleList, setPeopleList ] = React.useState([]);
  const [ filteredPeopleList, setFilteredPeopleList ] = React.useState([]);
  const friendsListener = React.useRef(null);
  const [ isRefreshing, setRefreshing ] = React.useState(true);
  const [ showHideBlockDialog, setShowHideBlockDialog ] = React.useState(false)
  const [ selectedPeople, setSelectedPeople ] = React.useState(null)

  const handleContactPress = (people) => {
    props.navigation.navigate("PeopleInformation", { peopleId: people.id });
  }

  const fetchData = () => {
    setRefreshing(true)
    friendsListener.current = FriendsAPI.getFriendsWithRealTimeUpdate(firebaseCurrentUser.uid, (friends) => {
      setFriendList(friends)
      setRefreshing(false)
    })
  }

  const handleSearchPress = (searchText) => {
    setFilteredPeopleList([])

    let clonedPeopleList = JSON.parse(JSON.stringify(peopleList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    clonedPeopleList = clonedPeopleList.filter((people) => {
      return (!blockedUserList.includes(people.id) && !blockedByUserList.includes(people.id) && !hiddenUserList.includes(people.id))
    })
    if(searchText){
      const filteredPeopleList = clonedPeopleList.filter((people) => {
        return (people && people.applicationInformation && people.applicationInformation.nickName.toLowerCase().indexOf(newSearchText.toLowerCase())) >= 0
      })
      setFilteredPeopleList(filteredPeopleList)
    } else setFilteredPeopleList(clonedPeopleList)
  }

  const handleDismissHideBlock = () => setShowHideBlockDialog(false)
  

  const handleLongPress = (people) => {
    setSelectedPeople(people)
    setShowHideBlockDialog(true)
  }

  const setFriendList = (peopleList1) => {
    if(peopleList1.length>0){
      const clonedFilteredPeopleList = JSON.parse(JSON.stringify(peopleList1))
      const filterPeopleList2 = clonedFilteredPeopleList.filter((people) => {
        return (!blockedUserList.includes(people.id) && !blockedByUserList.includes(people.id) && !hiddenUserList.includes(people.id))
      })
      setPeopleList(peopleList1)
      setFilteredPeopleList(filterPeopleList2)
    }
  }

  React.useEffect(() => {
    fetchData()
    return function cleanup(){
      if(friendsListener.current) friendsListener.current();
    }
  }, [])

  React.useEffect(() => {
    setFriendList(peopleList)
  }, [blockedUserList, blockedByUserList, hiddenUserList])
  
  return(
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent" }}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>{props.t("myContactLabel")}</HeadlineTitle>
      <View style={{ padding: 16 }}>
        <MySearchbar 
              onSubmitEditing={handleSearchPress}
              placeholder={props.t("searchContact")} />
      </View>
      <FlatList
        style={{ backgroundColor: "white" }}
        data={filteredPeopleList}
        onRefresh={()=>{}} 
        refreshing={isRefreshing} 
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return <PeopleListItem key={index} id={item.id} onPress={handleContactPress} onLongPress={handleLongPress}/>
        }}/>
        <HideBlockContactDialog visible={showHideBlockDialog} onDismiss={handleDismissHideBlock} people={selectedPeople}/>
    </View>
  )
}
ContactScreen.navigationOptions = { header: null }
export default withTranslation()(withCurrentUser(ContactScreen))