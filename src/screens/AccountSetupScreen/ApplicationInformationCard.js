import React from "react";
import { Card, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Tooltip } from 'react-native-elements';
import TextInput from "src/components/TextInput";
import Icon from 'react-native-vector-icons/FontAwesome';

const INITIAL_STATE = { nickName: "", id: "" }

export default class ApplicationInformationCard extends React.PureComponent{
  handleNickNameChange = nickName => this.setState({nickName});
  handleIdChange = id => {
    const lowerId = id.toLowerCase().trim()
    this.setState({id: lowerId})
  }

  constructor(props){
    super(props);

    INITIAL_STATE.id = props.defaultId
    INITIAL_STATE.nickName = props.defaultNickName
    this.state = INITIAL_STATE;
    this.handleNickNameChange = this.handleNickNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
  }

  getState(){ return this.state }

  render(){
    return(
      <Card>
        <Card.Title title="Informasi Akun" subtitle="Pastikan tidak memberikan data sensitif."/>
        <Card.Content>
          <View>
            <View style={{flexDirection:"row"}}>
              <Text style={styles.headerText}>Mono ID</Text>
              <Tooltip backgroundColor="grey" 
                popover={<Text style={{color:"white", padding:4}}>Mono ID adalah ID unik yang bisa kamu gunakan untuk identitas kamu.</Text>}>
                <Icon style={{marginLeft: 4}}  name="question-circle" size={16}/> 
              </Tooltip>
            </View>
            <TextInput 
              placeholder="Mono ID"
              textContentType="nickname"
              value={this.state.id}
              onChangeText={this.handleIdChange}/>
          </View>
          <View>
            <Text style={styles.headerText}>Nama Panggilam</Text>
            <TextInput 
              placeholder="Nama Panggilan"
              textContentType="name"
              value={this.state.nickName}
              onChangeText={this.handleNickNameChange}/>
          </View>
        </Card.Content>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  headerText: { paddingBottom: 4 }
})
