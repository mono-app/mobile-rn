import React from "react";
import { View, Image } from "react-native";
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
        <View style={{flex:1, backgroundColor: "#fff" }}>
            <Header navigation={this.props.navigation} title=""  />
            <View style={{flex: 1}}>
              <Image source={require('./images/intromono3.jpg')} 
                    resizeMode='contain'
                    style={{
                      flex:1,
                      alignSelf:"center",
                      height: "100%",
                      width: "100%",
                      }} />
            </View>
        </View>

    );
  }
}
