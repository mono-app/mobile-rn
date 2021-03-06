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
          setCurrentTeacherId={context.setCurrentTeacherId}
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

  handleCurrentTeacherId = async (schoolId, userId) => {
    const db = firebase.firestore();
    const schoolsCollection = new SchoolsCollection();
    const teachersCollection = new TeachersCollection();
    const schoolsDocumentRef = db.collection(schoolsCollection.getName()).doc(schoolId);
    const documentSnapshot = await schoolsDocumentRef.get();
    const school = { id: documentSnapshot.id, ...documentSnapshot.data() };
    this.setState({ school });
    const teachersDocumentRef = schoolsDocumentRef.collection(teachersCollection.getName()).doc(userId);

    this.userListener = teachersDocumentRef.onSnapshot((documentSnapshot) => {
      if(documentSnapshot.exists){
        const teacher = documentSnapshot.data();
        teacher.id = JSON.parse(JSON.stringify(documentSnapshot.id));
        if(teacher.gender){
          teacher.gender = teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1)
        }
        this.setState({ teacher });
     
      }
    });
  };

  constructor(props){
    super(props);
    this.userListener = null;
    this.state = { 
      school: {}, 
      teacher: {}, 
      setCurrentTeacherId: this.handleCurrentTeacherId 
    }
    this.handleCurrentTeacherId = this.handleCurrentTeacherId.bind(this);
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