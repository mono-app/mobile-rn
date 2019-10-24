import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { StyleSheet } from "react-native";

import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

function DatePickerWithTextInput(props){
  const [ isDatePickerVisible, setDatePickerVisible ] = React.useState(false);

  const styles = StyleSheet.create({
    label: { fontWeight: "bold" },
    listItemContainer: {
      marginTop: 16, backgroundColor: "#fff", flexDirection: "row",
      borderRadius: 8, padding: 16, paddingVertical: 12, alignItems: "center"
    },
    listDescriptionContainer: {
      flex: 1, flexDirection: "row", alignItems: "center", 
      justifyContent: "space-between"
    },
  })

  const showDateTimePicker = () => setDatePickerVisible(true)
  const hideDatePicker = () => setDatePickerVisible(false)
  const handleDatePicked = () => {
    hideDatePicker();
    const pickedDate = new moment(date).format("DD/MM/YYYY");
    if(props.onDatePicked) props.onDatePicked(pickedDate);
  }

  return (
    <React.Fragment>
      <TouchableOpacity onPress={showDateTimePicker}>
        <View style={styles.listItemContainer}>
          <View style={styles.listDescriptionContainer}>
            <Text style={styles.label}>
              {defaultValue}
            </Text>
            <View style={{ flexDirection: "row", textAlign: "right" }}>
              <EvilIcons name="calendar" size={24} style={{ color: "#5E8864" }}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <DateTimePicker
        date={(defaultValue)?moment(defaultValue, "DD-MM-YYYY").toDate():new Date()}
        isVisible={isDatePickerVisible}
        onConfirm={handleDatePicked}
        onCancel={hideDatePicker}
        mode={"date"}/>
    </React.Fragment>    
  )
}

DatePickerWithTextInput.propTypes = { onDatePicked: PropTypes.func.isRequired }
export default DatePickerWithTextInput;