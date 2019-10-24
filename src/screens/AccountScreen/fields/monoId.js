import React from "react";
import PropTypes from "prop-types";
import withObservables from "@nozbe/with-observables";

import { View } from "react-native";
import { Text } from "react-native-paper";

function MonoIdField(props){
  const { applicationInformation } = props;
  
  return (
    <View style={props.style}>
      <Text style={{ fontWeight: "500" }}>Mono ID</Text>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Text>{applicationInformation.monoId}</Text>
      </View>
    </View>
  )
}

MonoIdField.propTypes = { 
  people: PropTypes.any.isRequired,
  style: PropTypes.shape() 
}
MonoIdField.defaultProps = { style: {} }

const enhance = withObservables([ "people" ], ({ people }) => ({
  applicationInformation: people.applicationInformation.observe()
}))

export default enhance(MonoIdField);