import React from "react";
import PeopleAPI from "src/api/people";
import FriendsAPI from "src/api/friends";
import Database from "src/api/database";
import { default as UserModel } from "src/models/user";
import { default as UserEntity } from "src/entities/user";

function FriendListListener(){
  const listener = React.useRef(null);

  const handleChanges = async (changes) => {
    try{
      console.log(changes);
      await Database.synchronize(UserModel, changes);
    }catch(err){ console.log(err.stack) }
  }

  const initialize = async () => {
    const user = await PeopleAPI.getCurrentUser();
    listener.current = await FriendsAPI.listenFriendList(user, handleChanges);
  }

  React.useEffect(() => {
    initialize();
    return function cleanup(){
      if(listener.current) listener.current();
    }
  })

  return null;
}
export default FriendListListener;