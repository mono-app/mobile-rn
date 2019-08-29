import React from "react";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";
import moment from "moment"

const INITIAL_STATE = { announcement: {}, isFetching: false, showDateLabel: null, date: "-" }

export default class AnnouncementListItem extends React.Component{
  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    this.setState({ isFetching: true });

    const { announcement, prevDueDate, isFirstRow } = this.props;
    //const showDate = (isFirstRow && );
    let showDateLabel = true;
    let date = "-";
    if(announcement.task && prevDueDate){
      const firstDate = moment(announcement.task.dueDate.seconds * 1000).format("dddd, DD MMMM YYYY")
      const prevDate =  moment(prevDueDate.seconds * 1000).format("dddd, DD MMMM YYYY")
      date=firstDate
      
      if(firstDate===prevDate && !isFirstRow){
        showDateLabel=false;
      }
    }
    this.setState({ isFetching: false, announcement, showDateLabel, date });
  }

  render(){
    // if(this.state.isFetching){
    //   return (
    //     <ContentLoader height={50}>
    //       <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
    //     </ContentLoader>
    //   )
    // }
    
    return(
      <View>
        {(this.state.showDateLabel)? 
          <View style={{backgroundColor: "#DEDEDE", marginTop: 4}}>
            <Text style={{ fontWeight: "700", marginHorizontal: 16, marginVertical: 8 }}>{this.state.date}</Text>
          </View>
          : <View/>}

        <TouchableOpacity onPress={this.props.onPress}>
          <View style={styles.listItemContainer}>
            <View style={styles.listDescriptionContainer}>
              <View style={styles.listDescriptionContainer}>
                <Paragraph style={{ color: "#EF6F6C", marginRight: 4 }}>Pengumpulan Tugas</Paragraph>
                <Paragraph style={{  fontWeight:"700", marginRight: 4 }}>{ (this.state.announcement.task)? this.state.announcement.task.title : ""}</Paragraph>
                <Paragraph style={{ marginRight: 4 }}>pada kelas</Paragraph>
                <Paragraph style={{ fontWeight:"700" }}>{ (this.state.announcement.class)? this.state.announcement.class.subject : ""}</Paragraph>
              </View>
              <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864", alignSelf:"center" }}/>
            </View>
          </View>
        </TouchableOpacity>

      </View>

    )
  }
}

const styles = StyleSheet.create({
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flexDirection: "row", 
    flexWrap:"wrap",
    flex: 1,    
  },
})