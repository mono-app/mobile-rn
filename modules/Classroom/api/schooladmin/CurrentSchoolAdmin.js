import React from "react";
import firebase from "react-native-firebase";
import hoistNonReactStatics from 'hoist-non-react-statics';
import SchoolAPI from "modules/Classroom/api/school"
import { SchoolAdminsCollection, SchoolsCollection } from "src/api/database/collection";

const CurrentSchoolAdminContext = React.createContext();
export function withCurrentSchoolAdmin(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentSchoolAdminContext.Consumer>
        {(context) => <Component {...props} ref={ref}
          setCurrentSchoolAdminEmail={context.setCurrentSchoolAdminEmail}
          setCurrentSchoolId={context.setCurrentSchoolId}
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

  handleCurrentSchoolId = async (id) => {
    const school = await SchoolAPI.getDetail(id);
    this.setState({school})
  }

  handleCurrentSchoolAdminEmail = async (schoolId, email) => {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const schoolAdminsCollection = new SchoolAdminsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const schoolAdminsDocumentRef = schoolsDocumentRef.collection(schoolAdminsCollection.getName()).doc(email);

    this.userListener = schoolAdminsDocumentRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const schoolAdmin = documentSnapshot.data();
        schoolAdmin.email = JSON.parse(JSON.stringify(documentSnapshot.id));

        this.setState({ schoolAdmin });
          
        // if(schoolAdmin.profilePicture !== undefined){
        //   schoolAdmin.profilePicture = JSON.parse(JSON.stringify(schoolAdmin.profilePicture.downloadUrl));
        // }else schoolAdmin.profilePicture = "https://picsum.photos/200/200/?random";
        
      }
    });
  };

  constructor(props){
    super(props);
    this.userListener = null;
    this.state = { 
      school: {}, 
      schoolAdmin: {}, 
      setCurrentSchoolId: this.handleCurrentSchoolId,
      setCurrentSchoolAdminEmail: this.handleCurrentSchoolAdminEmail 
    }
    this.handleCurrentSchoolId = this.handleCurrentSchoolId.bind(this);
    this.handleCurrentSchoolAdminEmail = this.handleCurrentSchoolAdminEmail.bind(this);
  }

 
  componentWillUnmount(){
    if(this.userListener) this.userListener();
  }

  render(){
    return (
      <CurrentSchoolAdminContext.Provider value={this.state}>
        {this.props.children}
      </CurrentSchoolAdminContext.Provider>
    )
  }
}