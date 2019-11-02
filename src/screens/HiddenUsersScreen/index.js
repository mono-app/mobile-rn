import React from "react";
import { withCurrentUser } from "src/api/people/CurrentUser";
import AppHeader from "src/components/AppHeader";
import Container from "src/components/Container";
import { View, StyleSheet, FlatList } from "react-native";
import PeopleListItem from "src/components/PeopleListItem";

function HiddenUsersScreen(props){
  const { navigation, currentUser, hiddenUserList } = props;
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
    props.navigation.navigate("PeopleInformation", { peopleId: people.id });
  }

  React.useEffect(() => {
   
    return function cleanup(){
      _isMounted.current=false
    }
  }, [])

  if(currentUser === {}) return;
  return (
    <Container>
      <AppHeader navigation={navigation} title="Hidden Users" style={{ backgroundColor: "#fff" }}/>
      <View style={styles.container}>
        <FlatList
          style={{ backgroundColor: "white" }}
          data={hiddenUserList}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return <PeopleListItem key={index} id={item} onPress={handleContactPress}/>
          }}/>
      </View>
    </Container> 
  )
}
HiddenUsersScreen.navigationOptions = { header: null } 
export default withCurrentUser(HiddenUsersScreen)