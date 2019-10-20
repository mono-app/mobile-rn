import React from "react";

import AppHeader from "src/components/AppHeader";

function Header(props){ 
  handleBackPress = () => props.navigation.goBack(null)
  return <AppHeader {...props} overrideBack={handleBackPress}/>
}
export default Header;