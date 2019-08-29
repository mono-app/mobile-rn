import React from "react";
import firebase from "react-native-firebase";
import hoistNonReactStatics from 'hoist-non-react-statics';
import SchoolAPI from "modules/Classroom/api/school"
import { TeachersCollection, SchoolsCollection } from "src/api/database/collection";

const CurrentTeacherContext = React.createContext();
export function withCurrentTeacher(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentTeacherContext.Consumer>
        {(context) => <Component {...props} ref={ref}
          setCurrentTeacherEmail={context.setCurrentTeacherEmail}
          setCurrentSchoolId={context.setCurrentSchoolId}
          currentTeacher = {context.teacher}
          currentSchool = {context.school}
          />}
      </CurrentTeacherContext.Consumer>
    )
  })
  hoistNonReactStatics(WrapperComponent, Component);
  return WrapperComponent;
}

export class CurrentTeacherProvider extends React.PureComponent{
  static navigationOptions = () => {
    return { header: null };
  };

  handleCurrentSchoolId = async (id) => {
    const school = await SchoolAPI.getDetail(id);
    this.setState({school})
  }

  handleCurrentTeacherEmail = async (schoolId, email) => {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const teachersCollection = new TeachersCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const teachersDocumentRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(email);

    this.userListener = teachersDocumentRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const teacher = documentSnapshot.data();
        teacher.email = JSON.parse(JSON.stringify(documentSnapshot.id));

        this.setState({ teacher });
          
        // if(teacher.profilePicture !== undefined){
        //   teacher.profilePicture = JSON.parse(JSON.stringify(teacher.profilePicture.downloadUrl));
        // }else teacher.profilePicture = "https://picsum.photos/200/200/?random";
        
      }
    });
  };

  constructor(props){
    super(props);
    this.userListener = null;
    this.state = { 
      school: {}, 
      teacher: {}, 
      setCurrentSchoolId: this.handleCurrentSchoolId,
      setCurrentTeacherEmail: this.handleCurrentTeacherEmail 
    }
    this.handleCurrentSchoolId = this.handleCurrentSchoolId.bind(this);
    this.handleCurrentTeacherEmail = this.handleCurrentTeacherEmail.bind(this);
  }

 
  componentWillUnmount(){
    if(this.userListener) this.userListener();
  }

  render(){
    return (
      <CurrentTeacherContext.Provider value={this.state}>
        {this.props.children}
      </CurrentTeacherContext.Provider>
    )
  }
}