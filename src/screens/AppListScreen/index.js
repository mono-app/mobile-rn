import React from "react";

import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

import MenuListItemWithIcon from "src/components/MenuListItemWithIcon";
import HeadlineTitle from "src/components/HeadlineTitle";

function AppListScreen(props){  
  const handleItemPress = (item) => {
    const { navigateTo } = item;
    props.navigation.navigate(navigateTo);
  }

  return(
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent" }}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}>Applikasi</HeadlineTitle>
      <FlatList
        data={[
          { title: "Classroom", icon: <MaterialIcons name="class" size={24}/>, navigateTo: "Classroom" },
          { title: "News", icon: <MaterialCommunityIcons name="newspaper" size={24}/>, navigateTo: "News" }
        ]}
        renderItem={({ item, index }) => {
          return <MenuListItemWithIcon key={index} item={item} onPress={handleItemPress}/>
        }}/>
    </View>
  )
}
AppListScreen.navigationOptions = { header: null }
export default AppListScreen;