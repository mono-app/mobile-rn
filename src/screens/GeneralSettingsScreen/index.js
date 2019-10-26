import React from "react";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { Provider, Modal, Text, Portal } from 'react-native-paper';
import { Card } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import Toast from 'react-native-easy-toast'
import Key from 'src/helper/key'
import {AsyncStorage} from 'react-native';

function GeneralSettingsScreen(props){
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

  const handleLanguageIDPress = () => {
    AsyncStorage.setItem(Key.KEY_APP_LANGUAGE, "in_ID");
    toastRef.current.show(props.t("restartTakeAffect"), 1000);
    closeLanguageModal()
  }

  const handleLanguageEnPress = () => {
    AsyncStorage.setItem(Key.KEY_APP_LANGUAGE, "en_US");
    toastRef.current.show(props.t("restartTakeAffect"), 1000);
    closeLanguageModal()
  }

  const openLanguageModal = () => {
    setWallpaperModalVisible(true)
  }

  const closeLanguageModal = ()=> {
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
        <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>General Settings</HeadlineTitle>
        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={openLanguageModal}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>{props.t("language")}</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Modal visible={isWallpaperModalVisible} onDismiss={closeLanguageModal}>
          <Card style={{margin:16}}>
            <Card.Content style={{flexDirection:"row",justifyContent:"space-evenly", alignItems:"center", paddingVertical:30}}>
                <TouchableOpacity style={{alignItems:"center"}} onPress={handleLanguageIDPress}>
                  <Text style={{textAlign:"center", fontSize: 12, padding:8}}>Indonesia</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:"center"}} onPress={handleLanguageEnPress}>
                  <Text style={{textAlign:"center", fontSize: 12, padding:8}}>English</Text>
                </TouchableOpacity>

            </Card.Content>
          </Card>
        </Modal>
        <Toast ref={toastRef} position='center' />
      </Portal>
    </Provider>
  )
}
GeneralSettingsScreen.navigationOptions = { header: null }
export default withTranslation()(GeneralSettingsScreen)