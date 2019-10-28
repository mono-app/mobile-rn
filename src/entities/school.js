export default class School{

  constructor(id){
    this._id = id
  }

  get id(){ return this._id }
  set id(value){ this._id = value }
}