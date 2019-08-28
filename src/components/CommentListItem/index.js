import React from "react";
import moment from "moment";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Caption, Paragraph } from "react-native-paper";
import FastImage from "react-native-fast-image";
import SquareAvatar from "src/components/Avatar/Square";

const INITIAL_STATE = { posterEmail: null, comment: {}, isLoading: true }

export default class CommentListItem extends React.Component{

  refreshDetail = async () => {
    this.setState({ isLoading: true });
    const { comment } = this.props;
    this.setState({ isLoading: false, comment });
  }

  constructor(props){
    super(props);
    this.state = { ...INITIAL_STATE, ...this.props };
    this.refreshDetail = this.refreshDetail.bind(this);
  }

  componentDidMount(){ this.refreshDetail(); }

  render(){
    const window = Dimensions.get("window");

    if(this.state.isLoading) return <View/>
    const { comment } = this.state;

    const hasImage = (comment.images && comment.images.length > 0)
    let remainingImageCount = 0;
    if(comment.images && comment.images.length>4){
      remainingImageCount = comment.images.length-4;
    }
    
    let timeFromNow = moment(comment.creationTime.seconds*1000).format("DD MMMM YYYY HH:mm");
  

    return(
      <View style={{ marginTop: 8, borderBottomWidth:1, borderBottomColor: "#E8EEE8"}}>
          <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
            <SquareAvatar size={40} uri={"https://picsum.photos/200/200/?random"}/>
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontWeight: "700" }}>{comment.posterEmail}</Text>
              <Caption style={{ marginTop: 0 }}>{timeFromNow}</Caption>
            </View>
          </View>
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <Paragraph>{comment.comment} 
            </Paragraph>
          </View>

          { hasImage?(
            <TouchableOpacity onPress={this.props.onImagePress}>
              <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 4 }}>
                  {comment.images.map((item, index) => {
                    if((index >= 0 && index < 3)) {
                      return (
                        <FastImage 
                          key={index} 
                          resizeMode="cover"
                          source={{ uri: item.downloadUrl  }} 
                          style={{ height: (window.width/4), width: (window.width/4), flex:1, margin:4, borderRadius: 8 }}/>
                          
                      )
                    }else if(index === 3) return (
                      <View key={index} style={{ alignSelf: "stretch", flex: 1, height: (window.width/4), margin:4}}>
                        <FastImage source={{ uri: item.downloadUrl }} style={{ alignSelf: "stretch", flex: 1, borderRadius: 8 }} resizeMode="cover"/>
                        {(remainingImageCount>0)? 
                          <View style={{ borderRadius: 8, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, .7)", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "white" }}>+ {remainingImageCount}</Text>
                          </View>
                          :<View/>}
                      </View>
                    );
                  })}
              </View>
            </TouchableOpacity>

          ):<View/>}
      
      </View>
    )
  }
}
