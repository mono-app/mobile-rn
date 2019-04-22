import React from "react";
import { View, FlatList } from "react-native";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

import MenuListItemWithIcon from "../../components/MenuListItemWithIcon";

export default class AppListScreen extends React.Component{
  static navigationOptions = { headerTitle: "Applikasi" }
  
  render(){
    return(
      <View style={{ flex: 1 }}>
        <FlatList
          data={[
            { title: "Classroom", icon: <MaterialIcons name="class" size={24}/>, navigateTo: "Classroom" },
            { title: "News", icon: <MaterialCommunityIcons name="newspaper" size={24}/>, navigateTo: "News" }
          ]}
          renderItem={({ item, index }) => {
            return (
              <MenuListItemWithIcon
                key={index}
                onPress={() => this.props.navigation.navigate(item.navigateTo)}
                icon={item.icon}
                title={item.title}/>
            )
          }}/>
      </View>
    )
  }
}