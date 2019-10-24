import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import withObservables from "@nozbe/with-observables";
import { withTranslation } from "react-i18next";
import { withNavigation } from "react-navigation";

import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function BirthdayField(props){
  const { personalInformation, navigation } = props;

  const handleSave = async (value) => await personalInformation.updateBirthday(value);
  const handlePress = () => {
    const payload = {
      caption: "Format tanggal lahir: 22/12/2007",
      placeholder: "DD/MM/YYYY",
      fieldValue: personalInformation.birthday,
      fieldTitle: props.t("birthDate"),
      datePicker: true,
      beforeSave: (value) => moment(value, "DD/MM/YYYY").isValid(),
      onSave: handleSave
    }
    navigation.navigate("EditSingleField", payload);
  }

  return (
    <TouchableOpacity style={props.style} onPress={handlePress}>
      <Text style={{ fontWeight: "500" }}>{props.t("birthDate")}</Text>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {personalInformation.birthday?(
          <Text>{moment(personalInformation.birthday, "DD/MM/YYYY").format("DD MMM YYYY")}</Text>
        ):<Text>-</Text>}
        <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
      </View>
    </TouchableOpacity>
  )
}

BirthdayField.propTypes = {
  style: PropTypes.any,
  people: PropTypes.any.isRequired
}
BirthdayField.defaultProps = { style: {} }

const enhance = withObservables([ "people" ], ({ people }) => ({
  personalInformation: people.personalInformation.observe()
}))

export default enhance(withNavigation(withTranslation()(BirthdayField)));