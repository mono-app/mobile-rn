import React from "react";
import FriendsAPI from "src/api/friends";
import { withCurrentUser } from "src/api/people/CurrentUser";

import PeopleListItem from "src/components/PeopleListItem";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";
import MySearchbar from "src/components/MySearchbar"
import { withTranslation } from 'react-i18next';
import PeopleAPI from "src/api/people";

function GroupChatDetailsScreen(props){
  const room = props.navigation.getParam("room", null);
  const title = props.navigation.getParam("title", null);
  const subtitle = props.navigation.getParam("subtitle", null);
  const [ peopleList, setPeopleList ] = React.useState([]);
  const [ filteredPeopleList, setFilteredPeopleList ] = React.useState([]);
  const [ isRefreshing, setRefreshing ] = React.useState(true);

  const fetchData = async () => {
    setRefreshing(true)
    const arrayOfPromise = room.audiences.map(userId => PeopleAPI.getDetailById(userId, true))
    const users = await Promise.all(arrayOfPromise)
    const usersData = users.map(user => user.data)
    setPeopleList(usersData)
    setFilteredPeopleList(usersData)
    setRefreshing(false)
  }

  const handleSearchPress = (searchText) => {
    setFilteredPeopleList([])

    let clonedPeopleList = JSON.parse(JSON.stringify(peopleList))
    if(searchText){
      const filteredPeopleList = clonedPeopleList.filter((people) => {
        return (people && people.applicationInformation && people.applicationInformation.nickName.toLowerCase().indexOf(searchText.toLowerCase())) >= 0
      })
      setFilteredPeopleList(filteredPeopleList)
    } else {
      setFilteredPeopleList(clonedPeopleList)
    }
  }

  React.useEffect(() => {
    fetchData()
    return function cleanup(){

    }
  }, [])

  return(
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent" }} title={title} subtitle={subtitle} navigation={props.navigation}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>{room.audiences.length} {props.t("participant")}</HeadlineTitle>
      <FlatList
        style={{ backgroundColor: "white" }}
        data={filteredPeopleList}
        onRefresh={()=>{}} 
        refreshing={isRefreshing} 
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return <PeopleListItem key={index} id={item.id} user={item} />
        }}/>
    </View>
  )
}
GroupChatDetailsScreen.navigationOptions = { header: null }
export default withTranslation()(GroupChatDetailsScreen)