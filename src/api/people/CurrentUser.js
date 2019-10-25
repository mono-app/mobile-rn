import React from "react";
import Logger from "src/api/logger";
import firebase from "react-native-firebase";
import PeopleAPI from "src/api/people";
import hoistNonReactStatics from 'hoist-non-react-statics';
import { UserCollection, FriendListCollection, BlockedCollection, HideCollection, BlockedByCollection } from "src/api/database/collection";

const CurrentUserContext = React.createContext();
export function withCurrentUser(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentUserContext.Consumer>
        {(context) => 
          <Component {...props} ref={ref}
            currentUser={context.user}
            isLoggedIn={context.isLoggedIn}
            setCurrentUserEmail={context.handleCurrentUserEmail}
            blockedUserList={context.blockedUserList}
            blockedByUserList={context.blockedByUserList}
            hiddenUserList={context.hiddenUserList}
          />}

      </CurrentUserContext.Consumer>
    )
  })
  hoistNonReactStatics(WrapperComponent, Component);
  return WrapperComponent;
}

export function useCurrentUser(){
  const { user, handleCurrentUserEmail, isLoggedIn, blockedUserList, hiddenUserList } = React.useContext(CurrentUserContext);
  return { currentUser: user, isLoggedIn, setCurrentUserEmail: handleCurrentUserEmail, blockedUserList, hiddenUserList }
}

export class CurrentUserProvider extends React.PureComponent{
  constructor(props){
    super(props);
    this.userListener = null;
    this.authListener = null;
    this.blockedUserListener = null;
    this.hiddenUserListener = null;
    this.state = { 
      user: {}, 
      isLoggedIn: false,
      handleCurrentUserEmail: this.handleCurrentUserEmail,
      blockedUserList: [],
      blockedByUserList: [],
      hiddenUserList: [],
    }
    this.handleCurrentUserEmail = this.handleCurrentUserEmail.bind(this);
  }

  handleCurrentUserEmail = async (email) => {
    const newUser = { email };
    this.setState({ user: newUser }); 

    const db = firebase.firestore();
    const userCollection = new UserCollection();
    const friendListCollection = new FriendListCollection();
    const blockedCollection = new BlockedCollection();
    const blockedByCollection = new BlockedByCollection();
    const hideCollection = new HideCollection();
    const userRef = db.collection(userCollection.getName()).doc(email); 
  
    this.userListener = userRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const userData = PeopleAPI.normalizePeople(documentSnapshot);
        Logger.log("CurrentUserProvider", userData);
        this.setState({ user: userData });
      }
    });
    
    const friendListDocRef = db.collection(friendListCollection.getName()).doc(email)
    const blockedColRef = friendListDocRef.collection(blockedCollection.getName())
      this.blockedUserListener = blockedColRef.onSnapshot((querySnapshot)=> {
        const queryDocumentSnapshotList = querySnapshot.docs
        const blockedUserList = queryDocumentSnapshotList.map(documentSnapshot => {
          return documentSnapshot.id
        })
        Logger.log("CurrentUserProvider#blockedUserList", "");
        this.setState({blockedUserList: blockedUserList})
      })

    const blockedByColRef = friendListDocRef.collection(blockedByCollection.getName())
      this.blockedByUserListener = blockedByColRef.onSnapshot((querySnapshot)=> {
        const queryDocumentSnapshotList = querySnapshot.docs
        const blockedByUserList = queryDocumentSnapshotList.map(documentSnapshot => {
          return documentSnapshot.id
        })
        Logger.log("CurrentUserProvider#blockedByUserList", "");

        this.setState({blockedByUserList: blockedByUserList})
      })
    
    const hideColRef = friendListDocRef.collection(hideCollection.getName())
        this.hiddenUserListener = hideColRef.onSnapshot((querySnapshot)=> {
        const queryDocumentSnapshotList = querySnapshot.docs
        const hiddenUserList = queryDocumentSnapshotList.map(documentSnapshot => {
          return documentSnapshot.id
        })
        Logger.log("CurrentUserProvider#hiddenUserList", "");
        this.setState({hiddenUserList: hiddenUserList})
      })
  };

  componentDidMount(){
    this.authListener = firebase.auth().onAuthStateChanged((user) => {
      Logger.log("CurrentUserProvider#isLoggedIn", `${(user)?true:false}`);
      const isLoggedIn = (user)? true: false;
      if(isLoggedIn) this.setState({ isLoggedIn });
      else this.setState({ isLoggedIn, user: {} });
    })
  }

  componentWillUnmount(){
    if(this.userListener) this.userListener();
    if(this.authListener) this.authListener();
    if(this.blockedUserListener) this.blockedUserListener();
    if(this.hiddenUserListener) this.hiddenUserListener();
    
  }

  render(){
    return (
      <CurrentUserContext.Provider value={this.state}>
        {this.props.children}
      </CurrentUserContext.Provider>
    )
  }
}
