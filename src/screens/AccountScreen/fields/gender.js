import React from "react";
import PropTypes from "prop-types";
import withObservables from "@nozbe/with-observables";
import { withTranslation } from "react-i18next";
import { withNavigation } from "react-navigation";

import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function GenderField(props){
  const { personalInformation, navigation } = props;

  const handleSave = async (value) => await personalInformation.updateGender(value);
  const handlePress = () => {
    const payload = {
      fieldValue: (personalInformation.gender)? personalInformation.gender: "male",
      fieldTitle: props.t("gender"),
      genderPicker: true,
      onSave: handleSave
    }
    navigation.navigate("EditSingleField", payload);
  }

  return (
    <TouchableOpacity style={props.style} onPress={handlePress}>
      <Text style={{ fontWeight: "500" }}>{props.t("gender")}</Text>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {personalInformation.gender?(
          <Text>{personalInformation.gender === "male"? "Pria": "Wanita"}</Text>
        ):null}
        <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
      </View>
    </TouchableOpacity>
  )
}

GenderField.propTypes = { 
  style: PropTypes.any,
  people: PropTypes.any.isRequired
}
GenderField.defaultProps = { style: {} }

const enhance = withObservables([ "people" ], ({ people }) => ({
  personalInformation: people.personalInformation.observe()
}))
export default enhance(withNavigation(withTranslation()(GenderField)));