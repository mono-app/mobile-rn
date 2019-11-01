import React from "react";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { Provider, Text, Portal } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import Toast from 'react-native-easy-toast'

function HelpScreen(props){
  const toastRef = React.useRef(null);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
    groupContainer: { flex:1,marginBottom: 16 },
    menu: { 
      padding: 16, backgroundColor: "white",  display: "flex",  justifyContent: "space-between",
      alignItems: "center", flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E8EEE8",
    }
  });

  handleContactSupportPress = async ()=>{

    props.navigation.navigate("ContactSupport")
  }

  React.useEffect(() => {
    return function cleanup(){
    }
  }, [])
  
  return(
    <Provider style={{ flex: 1, backgroundColor: "white" }}>
      <Portal>
        <AppHeader style={{ backgroundColor: "transparent" }} navigation={props.navigation}/>
        <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Help</HeadlineTitle>
        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={handleContactSupportPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "500" }}>Contact Support</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Toast ref={toastRef} position='center' />
      </Portal>
    </Provider>
  )
}
HelpScreen.navigationOptions = { header: null }
export default withTranslation()(HelpScreen)