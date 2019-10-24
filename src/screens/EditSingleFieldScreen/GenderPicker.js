import React from "react";
import PropTypes from "prop-types";

import { Picker } from "react-native";

function GenderPicker(props){
  const { value } = props;

  const handleGenderChange = (gender) => {
    if(props.onValueChange) props.onValueChange(gender)
  }

  return (
    <Picker selectedValue={value} onValueChange={handleGenderChange}>
      <Picker.Item label="Perempuan" value="female" />
      <Picker.Item label="Laki-Laki" value="male" />
    </Picker>
  )
}

GenderPicker.propTypes = { 
  onValueChange: PropTypes.func,
  value: PropTypes.string.isRequired
}
export default GenderPicker;