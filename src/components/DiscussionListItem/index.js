import React from "react";
import moment from "moment";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Caption, Paragraph } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import DiscussionAPI from "modules/Classroom/api/discussion";
import StudentAPI from "modules/Classroom/api/student";
import FastImage from "react-native-fast-image";
import SquareAvatar from "src/components/Avatar/Square";
import { classBody } from "@babel/types";

const INITIAL_STATE = { posterEmail: null, discussion: {}, isLoading: true}

export default class TimelineListItem extends React.Component{

  refreshDetail = async () => {
    const { schoolId, discussion } = this.props;
    this.setState({ isLoading: true });
    const student = await StudentAPI.getDetail(schoolId,discussion.posterEmail)
    this.setState({ isLoading: false, discussion, posterName: student.name });

  }

  constructor(props){
    super(props);

    this.state = { ...INITIAL_STATE, ...this.props };
    this.refreshDetail = this.refreshDetail.bind(this);
  }

  componentDidMount(){ this.refreshDetail(); }

  render(){
    let creationDate = "";
    let creationTime = "";

    if(this.state.discussion.creationTime){
       creationDate = moment(this.state.discussion.creationTime.seconds * 1000).format("DD MMMM YYYY");
       creationTime = moment(this.state.discussion.creationTime.seconds * 1000).format("HH:mm");
    }

    return(
      <Card style={{ elevation: 1, marginHorizontal: 8, marginTop: 8}}>
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
            <SquareAvatar size={40} uri={"https://picsum.photos/200/200/?random"}/>
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontWeight: "700" }}>{this.state.discussion.title}</Text>
              <Caption style={{ marginTop: 0 }}>Dibuat oleh {this.state.posterName}</Caption>
              <Caption style={{ marginTop: 0 }}>Diposting pada {creationDate} | Pukul {creationTime} WIB</Caption>
            </View>
          </View>
         
        </TouchableOpacity>
       
       
      </Card>
    )
  }
}

const styles = StyleSheet.create({
 
})