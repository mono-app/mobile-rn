import React from "react";
import { View } from "react-native";
import { Subheading } from "react-native-paper";
import Header from "modules/Classroom/components/Header";

export default class IntroductionScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };
 
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex:1, backgroundColor: "#E8EEE8", padding:32 }}>
        <Header navigation={this.props.navigation} title="Classroom" />
        <View style={{}}>
          <Subheading style={{fontWeight: "700"}}>Introduction about Classroom</Subheading>
          
        </View>
      </View>
    );
  }
}
