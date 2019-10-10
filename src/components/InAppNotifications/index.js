import React from "react";
import PropTypes from "prop-types";
import Logger from "src/api/logger";

import FriendRequest from "./FriendRequest";

function InAppNotifications(props){
  Logger.log("InAppNotifications#type", props.type);
  if(props.type === "friend-request") return <FriendRequest/>;
  else return null;
}

InAppNotifications.propTypes = { type: PropTypes.string.isRequired };
export default InAppNotifications;