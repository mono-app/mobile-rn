import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph, Card } from "react-native-paper";
import moment from "moment"
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

import FileAPI from "../../api/file";

const INITIAL_STATE = { title: "", details: "",dueDate: {}, isFetching: false }

/**
 * @param {string} title 
 * @param {boolean} autoFetch - by default is `false`
 * @param {string} classId - required when `autoFetch` is `true`
 */
export default class FileListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    const { schoolId, classId, fileId, autoFetch } = this.props;

    if(autoFetch && classId){
      this.setState({ isFetching: true });
      const api = new FileAPI();
      const promises = [ api.getDetail(schoolId, classId, fileId)];

      Promise.all(promises).then(results => {
        const file = results[0];
        const { title, creationTime } = file  
        this.setState({ isFetching: false, title, creationTime });
      })
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

    let { title, creationTime } = this.props;
    if(this.props.autoFetch){
      title = this.state.title;
      creationTime = this.state.creationTime;
    }

    return(
        <Card style={styles.container}> 
          <View  style={styles.subContainer}> 
            <TouchableOpacity onPress={this.props.onPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View>
                   <Text style={{ fontWeight: "700" }}>{title}</Text>
                   {
                    (creationTime)? 
                    <Paragraph style={{ color: "#5E8864", fontStyle:"italic"  }}>Diposting pada {moment(creationTime.seconds * 1000).format("DD MMMM YYYY")} | Pukul {moment(creationTime.seconds * 1000).format("HH:mm")}</Paragraph>
                    : 
                    <Text/>
                    } 
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
    margin:4,
  },
  subContainer: {
    paddingHorizontal:16,
    paddingVertical:8,
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