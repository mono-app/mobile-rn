import Email from "src/entities/email";
import Name from "src/entities/name";

export default class Student{

  constructor(email, name){
    this.email = email
    this.name = name
  }

  get id(){ return this._id }
  set id(value){ this._id = new Email(value) }

  get email(){ return this._email.address }
  set email(value){ this._email = new Email(value) }

  get name(){ return this._name.value.trim() }
  set name(value){  this._name = new Name(value) }
}