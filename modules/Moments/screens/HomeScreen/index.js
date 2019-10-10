import React from "react";
import MomentsAPI from "modules/Moments/api/moment";
import Logger from "src/api/logger";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { withCurrentUser } from "src/api/people/CurrentUser";
import MomentItem from "modules/Moments/components/MomentItem";
import Header from "modules/Moments/screens/HomeScreen/Header";
import { Snackbar } from "react-native-paper";
import DeleteDialog from "src/components/DeleteDialog";

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

  const fetchMoments = async () => {
    if(_isMounted.current) setIsRefreshing(true);
    const moments = await MomentsAPI.getMoments(currentUser.email)
    Logger.log("Moments.HomeScreen.fetchMoment", moments);
    if(_isMounted.current){
      setMoments(moments);
      setIsRefreshing(false);
    }
  }

  const handleSharePress = (item) => {
    payload = {
      moment: item,
      onComplete: ()=>{}
    }
    props.navigation.navigate("ShareMoment",payload)
  }

  const handleDeleteMomentPress = (item) => {
    selectedMoment.current = item
    deleteDialog.current.toggleShow()
  }

  const handleDeleteMomentYes = () => {
    deleteDialog.current.toggleShow()
    MomentsAPI.delete(selectedMoment.current.id).then(result => {
      if(result){
        setSnackbarDeleteSuccess(true)
      }
    })
  }

  React.useEffect(() => {
    fetchMoments();
    props.navigation.addListener("didFocus", (payload) => {
      if(payload.action.type === "Navigation/COMPLETE_TRANSITION") fetchMoments();
    })
    return () => { _isMounted.current = false };
  }, []);

  return(
    <SafeAreaView style={styles.container}>
      <FlatList
        data={moments} 
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh} 
        refreshing={isRefreshing} 
        style={{ flex: 1 }}
        windowSize={3} initialNumToRender={5} 
        renderItem={({ item, index }) => {
          if(props.blockedByUserList.includes(item.posterEmail)){
            return null
          }else if(props.blockedUserList.includes(item.posterEmail)){
            return null
          }else if(props.hiddenUserList.includes(item.posterEmail)){
            return null
          }
          return <MomentItem 
            moment={item} 
            style={{ marginTop: (index === 0)?8: 4, marginBottom: 8, marginHorizontal: 4 }} 
            navigation={props.navigation}
            onCommentPress={() => handleCommentPress(item)}
            onSharePress={() => handleSharePress(item)}
            onDeleteMomentPress={() => handleDeleteMomentPress(item)}
          />
          }
         
        }/>
        <DeleteDialog 
          ref ={i => deleteDialog.current = i}
          title= {"Apakah anda ingin menghapus gambar ini?"}
          onDeletePress={handleDeleteMomentYes}/>
        <Snackbar
          visible= {showSnackbarDeleteSuccess}
          onDismiss={() => setSnackbarDeleteSuccess(false)}
          style={{backgroundColor:"#0EAD69"}}
          duration={Snackbar.DURATION_SHORT}>
          Berhasil Menghapus
        </Snackbar>
  </SafeAreaView>
  )
}

HomeScreen.navigationOptions = { header: <Header/> }
export default withCurrentUser(HomeScreen);