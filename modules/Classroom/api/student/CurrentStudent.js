import React from "react";
import firebase from "react-native-firebase";
import hoistNonReactStatics from 'hoist-non-react-statics';
import SchoolAPI from "modules/Classroom/api/school"
import { StudentsCollection, SchoolsCollection } from "src/api/database/collection";

const CurrentStudentContext = React.createContext();
export function withCurrentStudent(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentStudentContext.Consumer>
        {(context) => <Component {...props} ref={ref}
          setCurrentStudentEmail={context.setCurrentStudentEmail}
          setCurrentSchoolId={context.setCurrentSchoolId}
          currentStudent = {context.student}
          currentSchool = {context.school}
          />}
      </CurrentStudentContext.Consumer>
    )
  })
  hoistNonReactStatics(WrapperComponent, Component);
  return WrapperComponent;
}

export class CurrentStudentProvider extends React.PureComponent{
  static navigationOptions = () => {
    return { header: null };
  };

  handleCurrentSchoolId = async (id) => {
    const school = await SchoolAPI.getDetail(id);
    this.setState({school})
  }

  handleCurrentStudentEmail = async (schoolId, email) => {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(email);

    this.userListener = studentsDocumentRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const student = documentSnapshot.data();
        student.email = JSON.parse(JSON.stringify(documentSnapshot.id));

        this.setState({ student });
          
        // if(student.profilePicture !== undefined){
        //   student.profilePicture = JSON.parse(JSON.stringify(student.profilePicture.downloadUrl));
        // }else student.profilePicture = "https://picsum.photos/200/200/?random";
        
      }
    });
  };

  constructor(props){
    super(props);
    this.userListener = null;
    this.state = { 
      school: {}, 
      student: {}, 
      setCurrentSchoolId: this.handleCurrentSchoolId,
      setCurrentStudentEmail: this.handleCurrentStudentEmail 
    }
    this.handleCurrentSchoolId = this.handleCurrentSchoolId.bind(this);
    this.handleCurrentStudentEmail = this.handleCurrentStudentEmail.bind(this);
  }

 
  componentWillUnmount(){
    if(this.userListener) this.userListener();
  }

  render(){
    return (
      <CurrentStudentContext.Provider value={this.state}>
        {this.props.children}
      </CurrentStudentContext.Provider>
    )
  }
}