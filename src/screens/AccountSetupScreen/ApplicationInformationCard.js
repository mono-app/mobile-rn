import React from "react";
import { StyleSheet } from "react-native";
import TextInput from "src/components/TextInput";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, Text } from "react-native-paper";
import { View } from "react-native";
import { Tooltip } from 'react-native-elements';

const INITIAL_STATE = { nickName: "", id: "" }

class ApplicationInformationCard extends React.PureComponent{
  handleNickNameChange = nickName => {
    this.setState({nickName});
  }
  handleIdChange = id => {
    const lowerId = id.toLowerCase().trim().replace(/[^a-zA-Z0-9_.]/gi,'')
    
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
        <Card.Title title={this.props.t("accountInfo")} subtitle={this.props.t("accountInfoDesc")}/>
        <Card.Content>
          <View>
            <View style={{flexDirection:"row"}}>
              <Text style={styles.headerText}>Mono ID</Text>
              <Tooltip backgroundColor="grey" 
                popover={
                  <Text style={{ color: "white" }}>{this.props.t("monoIdDesc")}</Text>
                }
                height={64} width={256}>
                <Icon style={{ marginLeft: 4 }} name="question-circle" size={14}/> 
              </Tooltip>
            </View>
            <TextInput 
              placeholder="Mono ID" autoCapitalize="none" textContentType="nickname"
              value={this.state.id} 
              maxLength={30}
              onChangeText={this.handleIdChange}/>
          </View>
          <View>
            <Text style={styles.headerText}>{this.props.t("nickName")}</Text>
            <TextInput 
              placeholder={this.props.t("nickName")} textContentType="name"
              maxLength={30}
              value={this.state.nickName} onChangeText={this.handleNickNameChange}/>
          </View>
        </Card.Content>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  headerText: { paddingBottom: 4 }
})

export default ApplicationInformationCard