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
          setCurrentStudentId={context.setCurrentStudentId}
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

  handleCurrentStudentId = async (schoolId, userId) => {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const studentsCollection = new StudentsCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);

    const documentSnapshot = await schoolsDocumentRef.get();
    const school = { id: documentSnapshot.id, ...documentSnapshot.data() };
    this.setState({ school });

    const studentsDocumentRef = schoolsDocumentRef.collection(studentsCollection.getName()).doc(userId);

    this.userListener = studentsDocumentRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const student = documentSnapshot.data();
        student.id = JSON.parse(JSON.stringify(documentSnapshot.id));

        if(student.gender){
          student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
        }
        if(this._isMounted)
          this.setState({ student });
      
      }
    });
  };

  constructor(props){
    super(props);
    this._isMounted = null
    this.userListener = null;
    this.state = { 
      school: {}, 
      student: {}, 
      setCurrentStudentId: this.handleCurrentStudentId 
    }
    this.handleCurrentStudentId = this.handleCurrentStudentId.bind(this);
  }

  componentDidMount(){
    this._isMounted=true
  }
 
  componentWillUnmount(){
    this._isMounted = false
    if(this.userListener) this.userListener();
    if(this.schoolListener) this.schoolListener();
  }

  render(){
    return (
      <CurrentStudentContext.Provider value={this.state}>
        {this.props.children}
      </CurrentStudentContext.Provider>
    )
  }
}