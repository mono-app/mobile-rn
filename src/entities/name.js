import CustomError from "src/entities/error";

export default class Name {
  // _value: string

  /**
   * 
   * @param {string} name 
   */
  constructor(name){
    this.value = name
  }

  get value() { return this._value.trim() }
  set value(value) {
    if(!isValidName(value)) throw new CustomError("name-must-be-char", "Name must be character");
    this._value = value
  }
}

function isValidName(value){
  const validRegex = /[^a-zA-Z ]/gi;
  return !validRegex.test(value);
}