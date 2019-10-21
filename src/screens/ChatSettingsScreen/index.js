import React from "react";
import { withCurrentUser } from "src/api/people/CurrentUser";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { Provider, Modal, Text, Portal } from 'react-native-paper';
import { Card } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import Toast from 'react-native-easy-toast'
import Utils from 'src/api/utils'
import {AsyncStorage} from 'react-native';

function ChatSettingsScreen(props){
  const { currentUser } = props;
  const toastRef = React.useRef(null);

  const [ isWallpaperModalVisible, setWallpaperModalVisible ] = React.useState(false);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
    groupContainer: { flex:1,marginBottom: 16 },
    menu: { 
      padding: 16, backgroundColor: "white",  display: "flex",  justifyContent: "space-between",
      alignItems: "center", flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E8EEE8",
    }
  });

  const handleDefaultColorPress = () => {
    AsyncStorage.setItem(Utils.KEY_STORAGE_CHAT_BACKGROUND, "#fff");
    toastRef.current.show('Chat background default', 1000);
    closeWallpaperModal()
  }

  const handleSolidColorPress = () => {
    props.navigation.navigate("ChatSolidColorPicker")
  }

  const openWallpaperModal = () => {
    setWallpaperModalVisible(true)
  }

  const closeWallpaperModal = ()=> {
    setWallpaperModalVisible(false)
  }

  React.useEffect(() => {
    return function cleanup(){
    }
  }, [])
  
  return(
    <Provider style={{ flex: 1, backgroundColor: "white" }}>
      <Portal>
        <AppHeader style={{ backgroundColor: "transparent" }} navigation={props.navigation}/>
        <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>{props.t("chatSetting")}</HeadlineTitle>
        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={openWallpaperModal}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Wallpaper</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Modal visible={isWallpaperModalVisible} onDismiss={closeWallpaperModal}>
          <Card style={{margin:16}}>
            <Card.Content style={{flexDirection:"row",justifyContent:"space-evenly", alignItems:"center", paddingVertical:30}}>
                <TouchableOpacity style={{alignItems:"center"}} onPress={handleDefaultColorPress}>
                  <Image width={32} height={32} source={require('./icons/default.png')} />
                  <Text style={{textAlign:"center", fontSize: 12}}>Default</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:"center"}} onPress={handleSolidColorPress}>
                  <Image width={32} height={32} source={require('./icons/solidcolor.png')} />
                  <Text style={{textAlign:"center", fontSize: 12}}>Solid Color</Text>
                </TouchableOpacity>

            </Card.Content>
          </Card>
        </Modal>
        <Toast ref={toastRef} position='center' />
      </Portal>
    </Provider>
  )
}
ChatSettingsScreen.navigationOptions = { header: null }
export default withTranslation()(withCurrentUser(ChatSettingsScreen))