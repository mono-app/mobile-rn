import React from "react";
import PropTypes from "prop-types";

import { ActivityIndicator, View } from "react-native";
import { Dialog, Text, Caption } from "react-native-paper";

function LoadingDialog(props){
  const { visible } = props;

  return (
    <Dialog visible={visible}>
      <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <ActivityIndicator/>
        <View>
          <Text>Sedang memuat data</Text>
          <Caption>Harap tunggu...</Caption>
        </View>
      </Dialog.Content>
    </Dialog>
  )
}

LoadingDialog.propTypes = { visible: PropTypes.bool.isRequired }
export default LoadingDialog;