import Name from "src/entities/name";
import User from "src/entities/user";

export default class Teacher extends User{
  // nik: string
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
  
  get name(){ return this._name.value.trim() }
  set name(value){  this._name = new Name(value) }
}