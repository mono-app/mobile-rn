import React from "react";
import { View, Image,TouchableOpacity,Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "modules/Classroom/components/Header";
import { Text, } from "react-native-paper";

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

            {/* <View style={{alignItems:"center", position:"absolute",top:40,bottom:0,left:0,right:0}}>
              <Image source={require('./images/logoclassroom.png')} style={{width: 100, height: 60}} />
              <Image source={require('./images/teacher.png')} style={{width: 180, height: 200}} />
              <Image source={require('./images/content1.png')} style={{width: 200, height: 150}} />
              <Image source={require('./images/content2.png')} style={{width: 300, height: 100}} />
              <TouchableOpacity>
                <Text style={{textAlign:"center", color:"#0EAD69", fontWeight:"500", fontSize:15}}>Pelajari Lebih Lanjut</Text>
                <Text style={{textAlign:"center"}}>Hubungi</Text>
              </TouchableOpacity>
              <Image source={require('./images/logomono.png')} style={{width: 100, height: 70}} />
            </View> */}
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
