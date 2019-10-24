import React from "react";
import PropTypes from "prop-types";
import OfflineDatabase from "src/api/database/offline";
import Logger from "src/api/logger";
import { Q } from "@nozbe/watermelondb";

import EnhancedPeopleListItem from "src/components/PeopleListItem/enhanced";

function PeopleListItem(props){
  const { email } = props;
  const [ people, setPeople ] = React.useState(null); 

  const fetchUser = async () => {
    const usersCollection = OfflineDatabase.database.collections.get("users");
    const [ user ] = await usersCollection.query(Q.where("email", email)).fetch();
    Logger.log("PeopleListItem.fetchUser#user", user);
    setPeople(user);
  }

  React.useEffect(() => {
    OfflineDatabase.synchronize();
    fetchUser();
  }, [])

  if(!people) return null;
  return <EnhancedPeopleListItem people={people}/>


}
PeopleListItem.propTypes = { onPress: PropTypes.func.isRequired }
PeopleListItem.defaultProps = { onPress: () => {} }

export default PeopleListItem;