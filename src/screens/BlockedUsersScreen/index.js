import React from "react";
import { withCurrentUser } from "src/api/people/CurrentUser";
import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import { View, StyleSheet, FlatList } from "react-native";
import FriendsAPI from "src/api/friends";
import PeopleListItem from "src/components/PeopleListItem";

function BlockedUsersScreen(props){
  const { navigation, currentUser, blockedUserList } = props;
  const _isMounted = React.useRef(true);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
    groupContainer: { marginBottom: 16 },
    menu: { 
      padding: 16, backgroundColor: "white",  display: "flex",  justifyContent: "space-between",
      alignItems: "center", flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E8EEE8",
    }
  });

  const handleContactPress = (people) => {
    props.navigation.navigate("PeopleInformation", { peopleEmail: people.email });
  }

  React.useEffect(() => {
  
    return function cleanup(){
      _isMounted.current=false
    }
  }, [])


  if(currentUser === {}) return;
  return (
    <Container>
      <AppHeader navigation={navigation} title="Blocked Users" style={{ backgroundColor: "#fff" }}/>
      <View style={styles.container}>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={blockedUserList}
          keyExtractor={(item) => item.email}
          renderItem={({ item, index }) => {
            return <PeopleListItem key={index} email={item} onPress={handleContactPress}/>
          }}/>
      </View>
    </Container> 
  )
}
BlockedUsersScreen.navigationOptions = { header: null } 
export default withCurrentUser(BlockedUsersScreen)