import Image from "src/entities/image";
import CustomError from "src/entities/error";

export default class MomentContent{

  /**
   * 
   * @param {string} message 
   * @param {Array} images 
   */
  constructor(message, images){
    this.message = message
    this.images = (images)?images:[]
  }

  get message() { return this._s }
  set message(value) { this._message = value }

  get images() { return this._images }
  set images(value) { 
    if(!Array.isArray(value)) throw new CustomError("images-must-array","Images type must be array")
    this._images = value 
  }

  set pushImage(value){
    if(!(value instanceof Image)) throw new CustomError("wrong-image-type","Value type must be Image Entity")
    this._images.push(value)
  }

}