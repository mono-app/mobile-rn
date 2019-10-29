import CustomError from "./error";
import MomentContent from "./momentContent";

export default class moment{
  // _content: MomentContent
  // _posterId: string

  /**
   * 
   * @param {MomentContent} content 
   * @param {string} posterId 
   */
  constructor(content, posterId){
    this.content = content
    this.posterId = posterId
  }

  get content() { return this._content }
  set content(value) { 
    if(!(value instanceof MomentContent)) throw new CustomError("wrong-value-type","Value type must be MomentContent Entity")
    this._content = value 
  }

  get posterId() { return this._posterId }
  set posterId(value) { 
    if(!value) throw new CustomError("poster-id-cannot-empty", "Poster ID cannot be empty")
    this._posterId = value 
  }
}