import React from "react";
import MomentsAPI from "modules/Moments/api/moment";
import Logger from "src/api/logger";
import { StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";

import MomentItem from "modules/Moments/components/MomentItem";
import CircleAvatar from "src/components/Avatar/Circle";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";

function HomeScreen(props){
  const { currentUser } = props;
  const [ moments, setMoments ] = React.useState([]);
  const [ isRefreshing, setIsRefreshing ] = React.useState(false);
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', alignItems: 'stretch', justifyContent: 'flex-start' },
    addToMomentContainer: {
      paddingLeft: 16, paddingRight: 16, alignItems: "center", justifyContent: "center", 
      backgroundColor: "#E8EEE8", borderRadius: 8, marginLeft: 16, marginRight: 16, flex: 1
    },
    leftAlignedContainerWithTopBorder: { 
      borderTopColor: "#E8EEE8", borderTopWidth: 1, flexDirection: "row", justifyContent: "flex-start", 
      alignItems: "center", padding: 16 
    }
  })

  const handleAddMomentPress = () => props.navigation.navigate("AddMoment")
  const handleRefresh = () => fetchMoments();
  const fetchMoments = async () => {
    setIsRefreshing(true);
    const moments = await MomentsAPI.getMoments(currentUser.email)
    Logger.log("Moments.HomeScreen.fetchMoment", moments);
    setMoments(moments);
    setIsRefreshing(false);
  }

  React.useEffect(() => {
    fetchMoments();
    props.navigation.addListener("didFocus", (payload) => {
      if(payload.action.type === "Navigation/COMPLETE_TRANSITION") fetchMoments();
    })
  }, []);

  return(
    <View style={styles.container}>
      <Surface style={{ padding: 16, elevation: 4, flexDirection: "row", justifyContent: "space-between" }}>
        <CircleAvatar size={50} uri={currentUser.profilePicture}/>
        <TouchableOpacity style={styles.addToMomentContainer} onPress={handleAddMomentPress}>
          <Text>Tambahkan moment</Text>
        </TouchableOpacity>
        <IconButton icon="add-a-photo"  size={24}/>
      </Surface>
      <FlatList
        data={moments} onRefresh={handleRefresh} refreshing={isRefreshing} style={{ flex: 1 }}
        windowSize={3} initialNumToRender={5} renderItem={({ item, index }) => (
          <MomentItem moment={item} style={{ marginTop: (index === 0)?8: 4, marginBottom: 8, marginHorizontal: 4 }}/>
        )}/>
    </View>
  )
}

HomeScreen.navigationOptions = { header: null }
export default withCurrentUser(HomeScreen);