import Email from "src/entities/email";
import Name from "src/entities/name";
import User from "./user";

export default class Student extends User{
  // ni: string
  // _name: string
  // address: string

  /**
   * 
   * @param {string} email 
   * @param {string} name 
   */
  constructor(email, name){
    super(null, email, null)
    this.name = name
  }

  get name(){ return this._name.value }
  set name(value){  this._name = new Name(value) }

}