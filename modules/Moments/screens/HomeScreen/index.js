import React from "react";
import MomentsAPI from "modules/Moments/api/moment";
import Logger from "src/api/logger";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { StyleSheet } from "react-native";

import MomentItem from "modules/Moments/components/MomentItem";
import Header from "modules/Moments/screens/HomeScreen/Header";
import DeleteDialog from "src/components/DeleteDialog";
import { FlatList } from "react-native";
import { Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-navigation";

function HomeScreen(props){
  const _isMounted = React.useRef(true);
  const deleteDialog = React.useRef(null);
  const selectedMoment = React.useRef(null);
  const { currentUser } = props;
  const [ moments, setMoments ] = React.useState([]);
  const [ isRefreshing, setIsRefreshing ] = React.useState(false);
  const [ showSnackbarDeleteSuccess, setSnackbarDeleteSuccess ] = React.useState(false);
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', alignItems: 'stretch', justifyContent: 'flex-start' },
    leftAlignedContainerWithTopBorder: { 
      borderTopColor: "#E8EEE8", borderTopWidth: 1, flexDirection: "row", justifyContent: "flex-start", 
      alignItems: "center", padding: 16 
    }
  })

  const handleRefresh = () => fetchMoments();
  const handleCommentPress = (item) => {
    payload = { momentId: item.id }
    props.navigation.navigate("MomentComments", payload)
  }

  const handleSharePress = (item) => {
    payload = { moment: item, onComplete: () => {} }
    props.navigation.navigate("ShareMoment", payload)
  }
  
  const handleProfilePress = (people) => {
    const payload = { peopleEmail: people.email }
    props.navigation.navigate("PeopleInformation", payload);
  }

  const handleDeleteMomentPress = (item) => {
    selectedMoment.current = item
    deleteDialog.current.toggleShow()
  }

  const handleDeleteMomentYes = () => {
    deleteDialog.current.toggleShow()
    MomentsAPI.delete(selectedMoment.current.id).then(result => {
      if(result && _isMounted.current){
        setSnackbarDeleteSuccess(true)
      }
    })
  }

  const fetchMoments = async () => {
    if(_isMounted.current) setIsRefreshing(true);
    const moments = await MomentsAPI.getMoments(currentUser.email)
    Logger.log("Moments.HomeScreen.fetchMoment#moments", moments);
    
    const filteredMoments = moments.filter(item => {
      if(props.blockedByUserList.includes(item.posterEmail)) return false
      else if(props.blockedUserList.includes(item.posterEmail)) return false
      else if(props.hiddenUserList.includes(item.posterEmail)) return false
      else return true
    });

    if(_isMounted.current){
      setMoments(filteredMoments);
      setIsRefreshing(false);
    }
  }

  React.useEffect(() => {
    fetchMoments();
    return () => { _isMounted.current = false };
  }, []);

  Logger.log("Moment.HomeScreen", "re-render");
  return(
    <SafeAreaView style={styles.container}>
      <FlatList
        data={moments}  keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}  refreshing={isRefreshing} 
        style={{ flex: 1 }} windowSize={3} initialNumToRender={20}
        renderItem={({ item, index }) => {
          return (
            <MomentItem 
              moment={item} style={{ marginTop: (index === 0)?8: 4, marginBottom: 8, marginHorizontal: 4 }} 
              onCommentPress={handleCommentPress} onSharePress={handleSharePress} onDeleteMomentPress={handleDeleteMomentPress} onProfilePress={handleProfilePress}/>
          )
        }
      }/>
      <DeleteDialog ref={deleteDialog} title= {"Apakah anda ingin menghapus gambar ini?"} onDeletePress={handleDeleteMomentYes}/>
      <Snackbar
        visible= {showSnackbarDeleteSuccess}
        onDismiss={() => setSnackbarDeleteSuccess(false)}
        style={{ backgroundColor:"#0EAD69" }}
        duration={Snackbar.DURATION_SHORT}>
          Berhasil Menghapus
      </Snackbar>
    </SafeAreaView>
  )
}

HomeScreen.navigationOptions = { header: <Header/> }
export default withCurrentUser(HomeScreen);