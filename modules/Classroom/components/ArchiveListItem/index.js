import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text,Subheading, Paragraph, Card } from "react-native-paper";
import moment from "moment"
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { task: {}, isFetching: false }

/**
 * @param {string} title 
 * @param {string} classId
 */
export default class ArchiveListItem extends React.Component{
  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    this.setState({ isFetching: true });

    const { task } = this.props;
    this.setState({ isFetching: false, task });
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader style={styles.userContainer}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }

    const title = this.state.task.title;
    const details = this.state.task.details;
    const dueDate = this.state.task.dueDate;
    let creationDate = ""
    let creationTime = ""
    if(dueDate){
      creationDate = moment(dueDate.seconds * 1000).format("DD MMMM YYYY")
      creationTime = moment(dueDate.seconds * 1000).format("HH:mm")
    }

    return(
        <Card style={styles.container}> 
          <View  style={styles.subContainer}> 
              <View style={styles.listItemContainer}>
                <View style={styles.listDescriptionContainer}>
                  <View>
                   <Subheading style={{ fontWeight: "700" }}>{title}</Subheading>
                  </View>
                </View>
              </View>
              <View style={{  borderBottomWidth:1, borderBottomColor: "#E8EEE8", paddingVertical: 8}}>
                <Text style={{ fontWeight: "700", marginTop: 8 }}>Detail Tugas</Text>

                <Paragraph>{details}</Paragraph>

                <Text style={{ fontWeight: "700", marginTop: 8 }}>Batas Akhir Pengumpulan</Text>
                <Text >Tanggal {creationDate}</Text>
                <Text >Pukul {creationTime}</Text>

              </View>
              <TouchableOpacity onPress={this.props.onSubmissionPress}>
                <View style={styles.listItemContainer}>
                <View style={[styles.listDescriptionContainer,{paddingVertical:8}]}>
                    <View>
                      <Text style={{ fontWeight: "700" }}>Lihat Pengumpulan</Text>
                    </View>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.props.onDiscussionPress}>
                <View style={styles.listItemContainer}>
                  <View style={[styles.listDescriptionContainer,{paddingVertical:8}]}>
                    <View>
                      <Text style={{ fontWeight: "700" }}>Diskusi</Text>
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
    justifyContent: "space-between", 
    borderBottomWidth:1,
    borderBottomColor: "#E8EEE8",
  },
  label: {
    fontWeight: "bold"
  }
})