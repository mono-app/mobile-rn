import React from "react";
import { withCurrentUser } from "src/api/people/CurrentUser";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Toast from 'react-native-easy-toast'
import Key from 'src/helper/key'
import AsyncStorage from '@react-native-community/async-storage';

function ChatSolidColorPickerScreen(props){
  const { currentUser } = props;
  const toastRef = React.useRef(null);

  const styles = StyleSheet.create({
    child: { flex:1, aspectRatio: 1,marginHorizontal:2 },
    
  });

  const handleSetColor = (colorCode) => {
    AsyncStorage.setItem(Key.KEY_CHAT_BACKGROUND, colorCode);
    toastRef.current.show('Chat background changed..', 1000);
  }

  React.useEffect(() => {
    return function cleanup(){
    }
  }, [])
  
  return(
    <View style={{ flex: 1, backgroundColor: "white" }}>
        <AppHeader style={{ backgroundColor: "transparent" }} navigation={props.navigation}/>
        <ScrollView>
          <View style={{paddingHorizontal: 2}}>
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity onPress={() => {handleSetColor("#d7dde9")}} style={{ ...styles.child ,backgroundColor: '#d7dde9'}}/>
              <TouchableOpacity onPress={() => {handleSetColor("#b7cce1")}} style={{ ...styles.child ,backgroundColor: '#b7cce1'}}/>
              <TouchableOpacity onPress={() => {handleSetColor("#7eb3e5")}} style={{ ...styles.child ,backgroundColor: '#7eb3e5'}}/>
            </View>
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity onPress={() => {handleSetColor("#3d8bcb")}} style={{ ...styles.child ,backgroundColor: '#3d8bcb'}}/>
              <TouchableOpacity onPress={() => {handleSetColor("#d7e1d9")}} style={{ ...styles.child ,backgroundColor: '#d7e1d9'}}/>
              <TouchableOpacity onPress={() => {handleSetColor("#cee5cb")}} style={{ ...styles.child ,backgroundColor: '#cee5cb'}}/>
            </View>
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity onPress={() => {handleSetColor("#c9e0ac")}} style={{ ...styles.child ,backgroundColor: '#c9e0ac'}}/>
              <TouchableOpacity onPress={() => {handleSetColor("#74ae74")}} style={{ ...styles.child ,backgroundColor: '#74ae74'}}/>
              <TouchableOpacity onPress={() => {handleSetColor("#cccfb2")}} style={{ ...styles.child ,backgroundColor: '#cccfb2'}}/>
            </View>
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity onPress={() => {handleSetColor("#a7a898")}} style={{ ...styles.child ,backgroundColor: '#a7a898'}}/>
              <TouchableOpacity onPress={() => {handleSetColor("#797073")}} style={{ ...styles.child ,backgroundColor: '#797073'}}/>
              <TouchableOpacity onPress={() => {handleSetColor("#000")}} style={{ ...styles.child ,backgroundColor: '#000'}}/>
            </View>
          </View>
        </ScrollView>
        <Toast ref={toastRef} position='center' />
    </View>
  )
}
ChatSolidColorPickerScreen.navigationOptions = { header: null }
export default ChatSolidColorPickerScreen