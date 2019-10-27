import firebase from "react-native-firebase";
import PeopleAPI from "src/api/people";
import CustomError from "src/entities/error";
import User from "src/entities/user";
import UserMappingAPI from "src/api/usermapping";

class AuthenticationAPI{
  static async initializeSession(){
    const currentUser = firebase.auth().currentUser;
    if(currentUser){
      const user = await PeopleAPI.getDetailById(currentUser.uid, true);
      if(user.isCompleteSetup) return user;
      else throw new CustomError("auth/need-setup", "You need to setup your account first");
    }else throw new CustomError("auth/not-found", "Session cannot be found. Initialize failed");
  }

  /**
   * 
   * @param {User} userEntity 
   */
  static async signIn(userEntity){
    const { user } = await firebase.auth().signInWithEmailAndPassword(userEntity.email, userEntity.password);
    await UserMappingAPI.setAccessToken(user.uid)
    return await PeopleAPI.getDetailById(user.uid, true);
  }
}
export default AuthenticationAPI;