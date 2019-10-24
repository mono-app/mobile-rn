import React from "react";
import { View, Image, Dimensions } from "react-native";
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
    const {width, height} = Dimensions.get("window")
    return (
        <View style={{ backgroundColor: "#fff" }}>
            <Header navigation={this.props.navigation} title=""  />
              <View>
                <Image source={require('./images/intromono3.jpg')} 
                  resizeMode='contain'
                  style={{
                    maxHeight: height-40,
                    maxWidth: width,
                    }} />
              </View>
        </View>

    );
  }
}
