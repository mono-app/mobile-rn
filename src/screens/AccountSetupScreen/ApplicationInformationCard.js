import React from "react";
import ApplicationInformation from "src/entities/applicationInformation";
import { StyleSheet } from "react-native";

import TextInput from "src/components/TextInput";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, Text } from "react-native-paper";
import { View } from "react-native";
import { Tooltip } from 'react-native-elements';

class ApplicationInformationCard extends React.PureComponent{
  handleNickNameChange = nickName => this.setState({ nickName });
  handleMonoIdChange = (monoId) => this.setState({ monoId });

  constructor(props){
    super(props);

    this.state = { monoId: props.defaultMonoId, nickName: props.defaultNickName };
    this.handleNickNameChange = this.handleNickNameChange.bind(this);
    this.handleMonoIdChange = this.handleMonoIdChange.bind(this);
  }

  getState(){ return this.state }

  render(){
    return(
      <Card>
        <Card.Title title={this.props.t("accountInfo")} subtitle={this.props.t("accountInfoDesc")}/>
        <Card.Content>
          <View>
            <View style={{ flexDirection:"row" }}>
              <Text style={styles.headerText}>Mono ID</Text>
              <Tooltip backgroundColor="grey" 
                popover={ <Text style={{ color: "white" }}>{this.props.t("monoIdDesc")}</Text> }
                height={64} width={256}>
                <Icon style={{ marginLeft: 4 }} name="question-circle" size={14}/> 
              </Tooltip>
            </View>
            <TextInput 
              placeholder="Mono ID" autoCapitalize="none" textContentType="nickname"
              value={this.state.monoId} maxLength={30} onChangeText={this.handleMonoIdChange}/>
          </View>
          <View>
            <Text style={styles.headerText}>{this.props.t("nickName")}</Text>
            <TextInput 
              placeholder={this.props.t("nickName")} textContentType="name"
              maxLength={30} value={this.state.nickName} onChangeText={this.handleNickNameChange}/>
          </View>
        </Card.Content>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  headerText: { paddingBottom: 4 }
})

export default ApplicationInformationCard;