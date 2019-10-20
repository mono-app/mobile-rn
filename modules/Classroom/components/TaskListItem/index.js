import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph, Card } from "react-native-paper";
import moment from "moment"
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { title: "", details: "",dueDate: {}, isFetching: false }

/**
 * @param {string} title 
 * @param {string} classId
 */
export default class TaskListItem extends React.Component{
  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    this.setState({ isFetching: true });

    const { task } = this.props;
    const { title, details, dueDate } = task  
    this.setState({ isFetching: false, title, details, dueDate });
    
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader style={styles.userContainer}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }

    let { title, dueDate } = this.state;
    title = this.state.title;
    dueDate = this.state.dueDate;
    let creationDate = ""
    let creationTime = ""
    if(dueDate){
      creationDate = moment(dueDate.seconds * 1000).format("DD MMMM YYYY")
      creationTime = moment(dueDate.seconds * 1000).format("HH:mm")
    }

    return(
        <Card style={styles.container}> 
          <View  style={styles.subContainer}> 
            <TouchableOpacity onPress={this.props.onPress}>
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View style={{flex:1}}>
                   <Text style={{ fontWeight: "700", lineHeight:20 }}>{title}</Text>
                   <Paragraph style={{ color: "#5E8864", fontWeight: "bold", fontStyle:"italic" }}>Batas akhir pengumpulan</Paragraph>
                   <Paragraph style={{ color: "#5E8864", fontStyle:"italic"  }}>Tanggal {creationDate} | Pukul {creationTime}</Paragraph>
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