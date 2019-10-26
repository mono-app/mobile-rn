import Email from "src/entities/email";
import Password from"src/entities/password";

export default class User{
  // _email: Email;
  // _password: Password;
  // id: string;
  // isCompleteSetup: boolean;
  // phoneNumber: PhoneNumber

  /**
   * 
   * @param {string} id 
   * @param {string} email 
   * @param {boolean} isCompleteSetup 
   */
  constructor(id, email, isCompleteSetup){
    this.id = id;
    this.isCompleteSetup = isCompleteSetup;
    this.phoneNumber = null;
    this._email = new Email(email);
    this._password = null;
  }

  /**
   * 
   * @param {string} email 
   * @param {string} password 
   */
  static create(email, password){
    const user = new User();
    user.email = email;
    user.password = password;
    user.isCompleteSetup = false;
    return user;
  }

  get email(){ return this._email.address }
  set email(value){ this._email = new Email(value) }

  get password(){ return this._password.value }
  set password(value){ this._password = new Password(value) }
}
