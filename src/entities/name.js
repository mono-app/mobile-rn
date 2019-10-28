import CustomError from "src/entities/error";

export default class Name {

  constructor(name){
    this.value = name
  }

  get value() { return this._name.trim() }
  set value(value) {
    if(!isValidName(value)) throw new CustomError("name-must-be-char", "Name must be character");
    this._name = value
  }
}

function isValidName(value){
  const validRegex = /[^a-zA-Z ]/gi;
  return !validRegex.test(value);
}