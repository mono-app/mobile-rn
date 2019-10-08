import React from "react";
import FriendsAPI from "src/api/friends";
import { withCurrentUser } from "src/api/people/CurrentUser";

import PeopleListItem from "src/components/PeopleListItem";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";
import { Searchbar } from "react-native-paper";

function ContactScreen(props){
  const { currentUser } = props;
  const [ peopleList, setPeopleList ] = React.useState([]);
  const friendsListener = React.useRef(null);

  const handleContactPress = (people) => {
    props.navigation.navigate("PeopleInformation", { peopleEmail: people.email });
  }

  React.useEffect(() => {
    friendsListener.current = FriendsAPI.getFriendsWithRealTimeUpdate(currentUser.email, (friends) => {
      setPeopleList(friends);
    })
    return function cleanup(){
      if(friendsListener.current) friendsListener.current();
    }
  }, [])
  
  return(
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent" }}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Kontak-ku</HeadlineTitle>
      <View style={{ padding: 16 }}>
        <Searchbar placeholder="Cari kontak"/>
      </View>
      <FlatList
        style={{ backgroundColor: "white" }}
        data={peopleList}
        keyExtractor={(item) => item.email}
        renderItem={({ item, index }) => {
          return <PeopleListItem key={index} people={item} onPress={handleContactPress}/>
        }}/>
    </View>
  )
}
ContactScreen.navigationOptions = { header: null }
export default withCurrentUser(ContactScreen);