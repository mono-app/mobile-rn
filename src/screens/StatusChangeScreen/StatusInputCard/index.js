import React from "react";
import PropTypes from "prop-types";
import StatusAPI from "src/api/status";
import { useCurrentUser } from "src/api/people/CurrentUser";
import { withTranslation } from 'react-i18next';
import { View, TextInput } from "react-native";
import { Card, Button } from "react-native-paper";

function StatusInputCard(props){
  const [ status, setStatus ] = React.useState("");
  const [ isLoading, setIsLoading ] = React.useState(false);
  const { currentUser } = useCurrentUser();

  handleStatusChange = (status) => setStatus(status.replace("  "," "));
  handleSavePress = async () => {
    setIsLoading(true);
    await StatusAPI.postStatus(currentUser.email, status)
    setStatus("");
    setIsLoading(false);
    if(props.onSaved) props.onSaved();
  }

  return(
    <Card elevation={4} style={{ padding: 16, margin: 16 }}>
      <TextInput
        textAlignVertical="top" numberOfLines={4} fontSize={24} maxLength={256}
        style={{ minHeight: 128, maxHeight: 128}} placeholder={props.t("shareStatusNow")}
        value={status} onChangeText={handleStatusChange}
        multiline autoFocus/>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button mode="text"loading={isLoading} disabled={isLoading} onPress={handleSavePress}>
          {props.t("save")}
        </Button>
      </View>
    </Card>
  )
}
StatusInputCard.propTypes = { onSaved: PropTypes.func }
StatusInputCard.defaultProps = { onSaved: () => {} }

export default withTranslation()(StatusInputCard)