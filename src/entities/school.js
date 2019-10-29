export default class School{

  /**
   * 
   * @param {string} id 
   */
  constructor(id){
    this._id = id
  }

  get id(){ return this._id }
  set id(value){ this._id = value }
}