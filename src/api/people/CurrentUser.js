import React from "react";
import Logger from "src/api/logger";
import firebase from "react-native-firebase";
import { UserCollection } from "src/api/database/collection";

const CurrentUserContext = React.createContext();
export function withCurrentUser(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentUserContext.Consumer>
        {(context) => <Component {...props} ref={ref}
          currentUser={context.user}
          isLoggedIn={context.isLoggedIn}
          setCurrentUserEmail={context.handleCurrentUserEmail}/>}
      </CurrentUserContext.Consumer>
    )
  })

  return WrapperComponent;
}

export function useCurrentUser(){
  const { user, handleCurrentUserEmail, isLoggedIn } = React.useContext(CurrentUserContext);
  return { currentUser: user, isLoggedIn, setCurrentUserEmail: handleCurrentUserEmail }
}

export class CurrentUserProvider extends React.Component{
  constructor(props){
    super(props);
    this.userListener = null;
    this.authListener = null;
    this.state = { 
      user: {}, isLoggedIn: false,
      handleCurrentUserEmail: this.handleCurrentUserEmail 
    }

    this.handleCurrentUserEmail = this.handleCurrentUserEmail.bind(this);
  }

  handleCurrentUserEmail = async (email) => {
    const newUser = { email };
    this.setState({ user: newUser }); 

    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const userRef = db.collection(userCollection.getName()).doc(email); 
    this.userListener = userRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const userData = documentSnapshot.data();
        userData.email = JSON.parse(JSON.stringify(documentSnapshot.id));

        this.setState({ user: userData });
        Logger.log(userData);
          
        if(userData.isCompleteSetup) {
          if(userData.applicationInformation.profilePicture !== undefined){
            userData.profilePicture = JSON.parse(JSON.stringify(userData.applicationInformation.profilePicture.downloadUrl));
          }else userData.profilePicture = "https://picsum.photos/200/200/?random";
        }
      }
    });
  };

  componentDidMount(){
    this.authListener = firebase.auth().onAuthStateChanged((user) => {
      Logger.log(`isLoggedIn: ${(user)?true:false}`);
      const isLoggedIn = (user)? true: false;
      if(isLoggedIn) this.setState({ isLoggedIn });
      else this.setState({ isLoggedIn, user: {} });
    })
  }

  componentWillUnmount(){
    if(this.userListener) this.userListener();
    if(this.authListener) this.authListener();
  }

  render(){
    return (
      <CurrentUserContext.Provider value={this.state}>
        {this.props.children}
      </CurrentUserContext.Provider>
    )
  }
}
