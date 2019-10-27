import React from "react";
import firebase from "react-native-firebase";
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SchoolAdminsCollection, SchoolsCollection } from "src/api/database/collection";

const CurrentSchoolAdminContext = React.createContext();
export function withCurrentSchoolAdmin(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentSchoolAdminContext.Consumer>
        {(context) => <Component {...props} ref={ref}
          setCurrentSchoolAdminId={context.setCurrentSchoolAdminId}
          schoolProfilePicture={(context.school.profilePicture)? context.school.profilePicture.downloadUrl : "https://picsum.photos/200/200/?random"}
          currentSchoolAdmin = {context.schoolAdmin}
          currentSchool = {context.school}
          />}
      </CurrentSchoolAdminContext.Consumer>
    )
  })
  hoistNonReactStatics(WrapperComponent, Component);
  return WrapperComponent;
}

export class CurrentSchoolAdminProvider extends React.PureComponent{
  static navigationOptions = () => {
    return { header: null };
  };
  // handleCurrentSchoolId = async (id) => {
  //   const db = firebase.firestore();
  //   const schoolsCollection = new SchoolsCollection();
  //   const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(id);

  //   this.schoolListener = schoolsDocumentRef.onSnapshot((documentSnapshot) => {
  //     if(documentSnapshot.exists){
  //       const school = documentSnapshot.data();
  //       school.id = JSON.parse(JSON.stringify(documentSnapshot.id));
  //       this.setState({ school });
  //     }
  //   });
  // }

  handleCurrentSchoolAdminId = async (schoolId, userId) => {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const schoolAdminsCollection = new SchoolAdminsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    this.schoolListener = schoolsDocumentRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const school = documentSnapshot.data();
        school.id = JSON.parse(JSON.stringify(documentSnapshot.id));
        this.setState({ school });
      }
    });

    const schoolAdminsDocumentRef = schoolsDocumentRef.collection(schoolAdminsCollection.getName()).doc(userId);
    this.userListener = schoolAdminsDocumentRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const schoolAdmin = documentSnapshot.data();
        schoolAdmin.id = JSON.parse(JSON.stringify(documentSnapshot.id));
        this.setState({ schoolAdmin });
      }
    });
  };

  constructor(props){
    super(props);
    this.userListener = null;
    this.state = { 
      school: {}, 
      schoolAdmin: {}, 
      schoolProfilePicture: "",
      setCurrentSchoolAdminId: this.handleCurrentSchoolAdminId,
    }
    this.handleCurrentSchoolAdminId = this.handleCurrentSchoolAdminId.bind(this);
  }

 
  componentWillUnmount(){
    if(this.userListener) this.userListener();
    if(this.schoolListener) this.schoolListener();
  }

  render(){
    return (
      <CurrentSchoolAdminContext.Provider value={this.state}>
        {this.props.children}
      </CurrentSchoolAdminContext.Provider>
    )
  }
}