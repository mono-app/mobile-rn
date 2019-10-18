import React from "react";
import FriendsAPI from "src/api/friends";
import { withCurrentUser } from "src/api/people/CurrentUser";

import PeopleListItem from "src/components/PeopleListItem";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"

function ContactScreen(props){
  const { currentUser } = props;
  const [ peopleList, setPeopleList ] = React.useState([]);
  const [ filteredPeopleList, setFilteredPeopleList ] = React.useState([]);
  const friendsListener = React.useRef(null);
  const [ isRefreshing, setRefreshing ] = React.useState(true);

  const handleContactPress = (people) => {
    props.navigation.navigate("PeopleInformation", { peopleEmail: people.email });
  }

  const fetchData = () => {
    setRefreshing(true)
    friendsListener.current = FriendsAPI.getFriendsWithRealTimeUpdate(currentUser.email, (friends) => {
      setPeopleList(friends);
      setFilteredPeopleList(friends)
      setRefreshing(false)
    })
  }

  const handleSearchPress = (searchText) => {
    setFilteredPeopleList([])

    const clonedPeopleList = JSON.parse(JSON.stringify(peopleList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){
      const filteredPeopleList = clonedPeopleList.filter((people) => {
        return people.applicationInformation.nickName.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0
      })
      setFilteredPeopleList(filteredPeopleList)
    } else {
      setFilteredPeopleList(clonedPeopleList)
    }
  }

  React.useEffect(() => {
    fetchData()
    return function cleanup(){
      if(friendsListener.current) friendsListener.current();
    }
  }, [])
  
  return(
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent" }}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Kontak-ku</HeadlineTitle>
      <View style={{ padding: 16 }}>
        <MySearchbar 
              onSubmitEditing={handleSearchPress}
              placeholder="Cari kontak" />
      </View>
      <FlatList
        style={{ backgroundColor: "white" }}
        data={filteredPeopleList}
        onRefresh={()=>{}} 
        refreshing={isRefreshing} 
        keyExtractor={(item) => item.email}
        renderItem={({ item, index }) => {
          return <PeopleListItem key={index} email={item.email} onPress={handleContactPress}/>
        }}/>
    </View>
  )
}
ContactScreen.navigationOptions = { header: null }
export default withCurrentUser(ContactScreen);