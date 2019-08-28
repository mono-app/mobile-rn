import React from "react";
import Logger from "src/api/logger";
import firebase from "react-native-firebase";
import PeopleAPI from "src/api/people";
import hoistNonReactStatics from 'hoist-non-react-statics';
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
  hoistNonReactStatics(WrapperComponent, Component);
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
        const userData = PeopleAPI.normalizePeople(documentSnapshot);
        Logger.log("CurrentUserProvider", userData);
        this.setState({ user: userData });
      }
    });
  };

  componentDidMount(){
    this.authListener = firebase.auth().onAuthStateChanged((user) => {
      Logger.log("CurrentUserProvider", `isLoggedIn: ${(user)?true:false}`);
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
