import React from "react";
import PropTypes from "prop-types";
import withObservables from "@nozbe/with-observables";
import { withTranslation } from 'react-i18next';
import { withNavigation } from "react-navigation";

import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function NickNameField(props){
  const { applicationInformation, navigation } = props;

  const handleSave = async (value) => {
    await applicationInformation.updateNickName(value);
  }

  const handlePress = () => {
    const payload = {
      fieldValue: applicationInformation.nickName,
      fieldTitle: props.t("nickName"),
      onSave: handleSave
    }
    navigation.navigate("EditSingleField", payload);
  }

  return (
    <TouchableOpacity style={props.style} onPress={handlePress}>
      <Text style={{ fontWeight: "500" }}>{props.t("nickName")}</Text>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Text>{applicationInformation.nickName}</Text>
        <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
      </View>
    </TouchableOpacity>
  )
}

NickNameField.propTypes = { 
  people: PropTypes.any.isRequired,
  style: PropTypes.shape() 
}
NickNameField.defaultProps = { style: {} }

const enhance = withObservables([ "people" ], ({ people }) => ({
  applicationInformation: people.applicationInformation.observe()
}))

export default enhance(withNavigation(withTranslation()(NickNameField)));
