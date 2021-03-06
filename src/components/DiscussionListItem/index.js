import React from "react";
import moment from "moment";
import { View, TouchableOpacity } from "react-native";
import { Text, Card, Caption } from "react-native-paper";
import CircleAvatar from "src/components/Avatar/Circle";
import SchoolAPI from "modules/Classroom/api/school";
import { withTranslation } from 'react-i18next';
import HelperAPI from "src/api/helper";

const INITIAL_STATE = {  discussion: {}, isLoading: true, posterName:""}

class DiscussionListItem extends React.PureComponent{

  refreshDetail = async () => {
    const { schoolId, discussion } = this.props;
    this.setState({ isLoading: true });
    SchoolAPI.getUserName(schoolId, discussion.posterId).then(name=> {
      this.setState({posterName: name })
    })
    this.setState({ isLoading: false, discussion });
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
      <Card style={{ elevation: 1, marginHorizontal: 8, marginVertical: 4}}>
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start" }}>
            <CircleAvatar size={40} uri={HelperAPI.getDefaultProfilePic()}/>
            <View style={{ flex:1, marginLeft: 16 }}>
              <Text style={{ fontWeight: "700", fontSize:16 }} numberOfLines={2}>{this.state.discussion.title}</Text>
              <Caption style={{ marginTop: 0 }}>{this.props.t("createdBy")} {this.state.posterName}</Caption>
              <Caption style={{ marginTop: 0 }}>{this.props.t("postedAt")}: {creationDate} | {this.props.t("time")}: {creationTime} WIB</Caption>
            </View>
          </View>
         
        </TouchableOpacity>
       
       
      </Card>
    )
  }
}
export default withTranslation()(DiscussionListItem)