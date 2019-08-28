import React from "react";
import PropTypes from "prop-types";

import { StyleSheet } from "react-native";
import { Headline } from "react-native-paper";

function HeadlineTitle(props){
  const styles = StyleSheet.create({
    default: { fontSize: 36, lineHeight: 48, fontWeight: "900" }
  });

  return <Headline style={[ styles.default, props.style ]}>{props.children}</Headline>
}
HeadlineTitle.propTypes = { children: PropTypes.string.isRequired }
export default HeadlineTitle;