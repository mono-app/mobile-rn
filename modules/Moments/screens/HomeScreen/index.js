import React from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import { Text, Surface, Avatar, IconButton, Caption, Paragraph } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

export default class HomeScreen extends React.Component{
  static navigationOptions = { headerTitle: "Moments" }

  handleAddMomentPress = () => this.props.navigation.navigate("AddMoment");

  constructor(props){
    super(props);

    this.handleAddMomentPress = this.handleAddMomentPress.bind(this);
  }

  render(){
    return(
      <View style={styles.container}>
        <Surface style={{ padding: 16, elevation: 4, flexDirection: "row", justifyContent: "space-between" }}>
          <Avatar.Image size={50} source={{ uri: "https://picsum.photos/200/200/?random" }}/>
          <TouchableOpacity style={styles.addToMomentContainer} onPress={this.handleAddMomentPress}>
            <Text>Tambahkan moment</Text>
          </TouchableOpacity>
          <IconButton icon="add-a-photo"  size={24}/>
        </Surface>
        <FlatList
          data={[{}, {}, {}, {}]}
          renderItem={({ item }) => {
            const window = Dimensions.get("window");
            return(
              <Surface style={{ elevation: 1, marginTop: 8, marginBottom: 8 }}>
                <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
                  <Avatar.Image size={50} source={{ uri: "https://picsum.photos/200/200/?random" }}/>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: "700" }}>Frans Huang</Text>
                    <Caption style={{ marginTop: 0 }}>5 menit yang lalu</Caption>
                  </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                  <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras viverra eleifend diam luctus accumsan. Fusce ultrices vitae enim nec pellentesque. Interdum et malesuada fames ac ante ipsum primis in faucibus. </Paragraph>
                </View>
                <View style={{ backgroundColor: "gray", flex: 1 }}>
                  <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: 200, alignItems: "stretch", resizeMode: "cover" }}/>
                  <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
                    <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
                    <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
                    <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
                    <View style={{ alignSelf: "stretch", flex: 1, height: (window.width/4) }}>
                      <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
                      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, .7)", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "white" }}>+7</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ ...styles.leftAlignedContainerWithTopBorder, paddingVertical: 8}}>
                  <Caption style={{ marginRight: 16 }}>3 Fans</Caption>
                  <Caption>10 Komentar</Caption>
                </View>
                <View style={styles.leftAlignedContainerWithTopBorder}>
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
                    <MaterialCommunityIcons name="heart-outline" size={16} style={{ marginRight: 4 }}/>
                    <Caption>Suka</Caption>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4 }}/>
                    <Caption>Komentar</Caption>
                  </TouchableOpacity>
                </View>
              </Surface>
            )
          }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EEE8',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  addToMomentContainer: {
    paddingLeft: 16, paddingRight: 16, alignItems: "center", justifyContent: "center", 
    backgroundColor: "#E8EEE8", borderRadius: 8, marginLeft: 16, marginRight: 16,
    flex: 1
  },
  leftAlignedContainerWithTopBorder: { 
    borderTopColor: "#E8EEE8", borderTopWidth: 1, flexDirection: "row", justifyContent: "flex-start", 
    alignItems: "center", padding: 16 
  }
})