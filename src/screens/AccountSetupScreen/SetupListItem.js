import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { withTheme } from "react-native-paper";

import { TouchableOpacity, View } from "react-native";
import { Avatar, Subheading, Caption } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function SetupListItem(props){
  const { title, subtitle, onPress, isComplete, theme } = props;
  const [ iconName, setIconName ] = React.useState("priority-high");
  const [ iconStyle, setIconStyle ] = React.useState("notComplete");

  const styles = StyleSheet.create({
    default: { 
      marginHorizontal: 16, marginTop: 16, marginBottom: 8, display: "flex", 
      flexDirection: "row", alignItems: "center" 
    },
    notComplete: { backgroundColor: "#FFEB3B" },
    complete: { backgroundColor: theme.colors.primary }
  })

  const handlePress = () => onPress();

  React.useEffect(() => {
    if(isComplete){
      setIconName("done");
      setIconStyle("complete");
    }else{
      setIconName("priority-ight");
      setIconStyle("notComplete");
    }
  }, [isComplete])
  
  return(
    <TouchableOpacity style={[ styles.default, props.styles ]} onPress={handlePress}>
      <Avatar.Icon icon={iconName} style={styles[iconStyle]} color="white"/>
      <View style={{ marginHorizontal: 8, flexGrow: 1, flexShrink: 1 }}>
        <Subheading>{title}</Subheading>
        <Caption>{subtitle}</Caption>
      </View>
      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
    </TouchableOpacity>
  )
}

SetupListItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  isComplete: PropTypes.bool.isRequired,
  onPress: PropTypes.func
}
SetupListItem.defaultProps = { onPress: () => {}, isComplete: false }
export default withTheme(SetupListItem);