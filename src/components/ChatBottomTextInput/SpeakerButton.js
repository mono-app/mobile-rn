import React from "react";
import { IconButton, withTheme } from "react-native-paper";

const INITIAL_STATE = { isActive: false }

class SpeakerButton extends React.PureComponent{
  handlePress = () => this.setState({ isActive: !this.state.isActive });

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handlePress = this.handlePress.bind(this);
  }

  render(){
    const { colors } = this.props.theme;
    const { isActive } = this.state;
    const iconName = (isActive)? "volume-up": "volume-off";
    const iconColor = (isActive)? colors.primary: colors.disabled;

    return <IconButton icon={iconName} size={24} color={iconColor} onPress={this.handlePress}/>
  }
}

export default withTheme(SpeakerButton);