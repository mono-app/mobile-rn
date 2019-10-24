import React from "react";
import FriendsAPI from "src/api/friends";
import OfflineDatabase from "src/api/database/offline";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { withTranslation } from 'react-i18next';

import PeopleListItem from "src/components/PeopleListItem";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import MySearchbar from "src/components/MySearchbar"
import { NavigationEvents } from "react-navigation";
import { View, FlatList } from "react-native";

function ContactScreen(props){
  const { currentUser } = props;
  const [ peopleList, setPeopleList ] = React.useState([]);
  const [ filteredPeopleList, setFilteredPeopleList ] = React.useState([]);
  const [ isRefreshing, setRefreshing ] = React.useState(true);

  const friendsListener = React.useRef(null);

  const handleWillFocus = () => OfflineDatabase.synchronize()
  const handleContactPress = (people) => {
    props.navigation.navigate("PeopleInformation", { peopleEmail: people.email });
  }

  const handleSearchPress = (searchText) => {
    setFilteredPeopleList([])

    const clonedPeopleList = JSON.parse(JSON.stringify(peopleList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){
      const filteredPeopleList = clonedPeopleList.filter((people) => {
        return (people && people.applicationInformation && people.applicationInformation.nickName.toLowerCase().indexOf(newSearchText.toLowerCase())) >= 0
      })
      setFilteredPeopleList(filteredPeopleList)
    } else {
      setFilteredPeopleList(clonedPeopleList)
    }
  }

  const fetchData = () => {
    setRefreshing(true)
    friendsListener.current = FriendsAPI.getFriendsWithRealTimeUpdate(currentUser.email, (friends) => {
      setPeopleList(friends);
      setFilteredPeopleList(friends)
      setRefreshing(false)
    })
  }


  React.useEffect(() => {
    fetchData()
    return function cleanup(){
      if(friendsListener.current) friendsListener.current();
    }
  }, [])
  
  return(
    <React.Fragment>
      <NavigationEvents onWillFocus={handleWillFocus}/>
      <View style={{ flex: 1 }}>
        <AppHeader style={{ backgroundColor: "transparent" }}/>
        <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>{props.t("myContactLabel")}</HeadlineTitle>
        <View style={{ padding: 16 }}>
          <MySearchbar onSubmitEditing={handleSearchPress} placeholder="Cari kontak" />
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={filteredPeopleList}
          onRefresh={()=>{}} 
          refreshing={isRefreshing} 
          keyExtractor={(item) => item.email}
          renderItem={({ item, index }) => {
            return <PeopleListItem key={index} email={item.email} onPress={handleContactPress} />
          }}/>
      </View>
    </React.Fragment>
  )
}
ContactScreen.navigationOptions = { header: null }
export default withTranslation()(withCurrentUser(ContactScreen))