import Email from "src/entities/email";
import Password from"src/entities/password";
import CustomError from "src/entities/error";

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

  get email(){ return this._email.address }
  set email(value){ console.log(value); this._email = new Email(value) }

  get password(){ return this._password.value }
  set password(value){ this._password = new Password(value) }
}
