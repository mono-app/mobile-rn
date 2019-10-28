import CustomError from "./error";
import MomentContent from "./momentContent";

export default class moment{

  constructor(momentContent, posterId){
    this.momentContent = momentContent
    this.posterId = posterId
  }

  get momentContent() { return this._momentContent }
  set momentContent(value) { 
    if(!(value instanceof MomentContent)) throw new CustomError("wrong-value-type","Value type must be MomentContent Entity")
    this._momentContent = value 
  }

  get posterId() { return this._posterId }
  set posterId(value) { 
    if(!value) throw new CustomError("poster-id-cannot-empty", "Poster ID cannot be empty")
    this._posterId = value 
  }
}