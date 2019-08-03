import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph, Card } from "react-native-paper";
import moment from "moment"
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

import TaskAPI from "../../api/task";

const INITIAL_STATE = { title: "", details: "",dueDate: {}, isFetching: false }

/**
 * @param {string} title 
 * @param {boolean} autoFetch - by default is `false`
 * @param {string} classId - required when `autoFetch` is `true`
 */
export default class DiscussionListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    const { classId, taskId, autoFetch } = this.props;

    if(autoFetch && classId){
      this.setState({ isFetching: true });
      // const api = new TaskAPI();
      // const promises = [ api.getDetail("1hZ2DiIYSFa5K26oTe75", classId, taskId)];

      // Promise.all(promises).then(results => {
      //   const task = results[0];
      //   const { title, details, dueDate } = task  
      //   this.setState({ isFetching: false, title, details, dueDate });
      // })
    }
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader style={styles.userContainer}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }

    let { title,details,dueDate } = this.props;
    if(this.props.autoFetch){
      title = this.state.title;
      details = this.state.details;
      dueDate = this.state.dueDate;
    }

    return(
        <Card style={styles.container}> 
          <View  style={styles.subContainer}> 
            <TouchableOpacity onPress={this.props.onPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View>
                   <Text style={{ fontWeight: "700" }}>{title}</Text>
                   <Paragraph style={{ color: "#5E8864", fontWeight: "bold", fontStyle:"italic" }}>Batas akhir pengumpulan</Paragraph>
                   <Paragraph style={{ color: "#5E8864", fontStyle:"italic"  }}>Tanggal {moment(dueDate.seconds * 1000).format("DD MMMM YYYY")} | Pukul {moment(dueDate.seconds * 1000).format("HH:mm")}</Paragraph>
                  </View>
                  <View style={{flexDirection:"row",textAlign: "right"}}>
                    <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Card>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom:16,
  },
  subContainer: {
    margin:16,
  }, 
  listItemContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    fontWeight: "bold"
  }
})