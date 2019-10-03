import React from "react";
import Navigator from "src/api/navigator";
import { StackActions } from "react-navigation";
import { StyleSheet, View } from "react-native";

import { Appbar, Subheading, Caption } from "react-native-paper";

function Header(props){ 
  const styles = StyleSheet.create({ default: { backgroundColor: "white"} })
  handleBackPress = () => {
    const navigator = new Navigator(this.props.navigation);
    navigator.resetTo("Home", StackActions, {key: "AppTab"});
  }

  return(
    <Appbar.Header style={[ styles.default, props.styles ]}>
      <Appbar.BackAction onPress={this.handleBackPress}/>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexGrow: 1 }}>
        <Subheading>{props.title}</Subheading>
        <Caption>{props.subtitle}</Caption>
      </View>
    </Appbar.Header>
  )
}
export default Header;