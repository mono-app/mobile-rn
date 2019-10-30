import Email from "src/entities/email";
import Password from"src/entities/password";
import CustomError from "src/entities/error";
import ApplicationInformation from "src/entities/applicationInformation";
import Image from "src/entities/image"
import PersonalInformation from "src/entities/personalInformation";
import PhoneNumber from "src/entities/phoneNumber";

export default class User{
  // _email: Email;
  // _password: Password;
  // id: string;
  // isCompleteSetup: boolean;
  // phoneNumber: PhoneNumber
  // personalInformation: PersonalInformation
  // applicationInformation: ApplicationInformation

  /**
   * 
   * @param {string} id 
   * @param {string} email 
   * @param {boolean} isCompleteSetup 
   */
  constructor(id, email, isCompleteSetup){
    this.id = id? id: null;
    this.isCompleteSetup = isCompleteSetup? isCompleteSetup: false;
    this.phoneNumber = null;
    this._email = email? new Email(email): null;
    this._password = null;
  }

  /**
   * 
   * @param {string} email 
   * @param {string} password 
   * @param {string} verifyPassword
   */
  create(email, password, verifyPassword){
    if(password !== verifyPassword) throw new CustomError("user/password-different", "Password is not the same");
    this.email = email;
    this.password = password;
    this.isCompleteSetup = false;
  }

  /**
   * 
   * @param {DocumentSnapshot} documentSnapshot 
   */
  fromSnapshot(documentSnapshot){
    const data = documentSnapshot.data();
    this.id = documentSnapshot.id;
    this.email = data.email;
    this.isCompleteSetup = data.isCompleteSetup;
    this.phoneNumber = new PhoneNumber(data.phoneNumber.value) 

    if(data.isCompleteSetup){
      const monoId = data.applicationInformation.monoId
      const nickName = data.applicationInformation.nickName
      const applicationInformation = new ApplicationInformation(monoId, nickName)
      if(data.applicationInformation.profilePicture) {
        const downloadUrl = data.applicationInformation.profilePicture.downloadUrl
        const storagePath = data.applicationInformation.profilePicture.storagePath
        applicationInformation.profilePicture = new Image(downloadUrl, storagePath)
      }
      this.applicationInformation = applicationInformation
      const givenName = data.personalInformation.givenName
      const familyName = data.personalInformation.familyName
      const gender = data.personalInformation.gender
      this.personalInformation = new PersonalInformation(givenName, familyName, gender)
    }
    return this;
  }

  get email(){ return this._email.address }
  set email(value){ this._email = new Email(value) }

  get password(){ return this._password.value }
  set password(value){ this._password = new Password(value) }

  
  get data(){
    const transformedData = {}
    Object.keys(this).map((prop) => {
      const newProp = (prop.indexOf("_") === 0)? prop.substring(1): prop;
      transformedData[newProp] = this[prop];
    })
    return transformedData;
  }
}
