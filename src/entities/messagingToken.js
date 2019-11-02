import User from "src/entities/user";
import CustomError from "src/entities/error";

export default class MessagingToken{
  // _owner: User
  // token: string

  /**
   * 
   * @param {string} token 
   * @param {User} owner 
   */
  constructor(token, owner){
    if(!token) throw new CustomError("messaging-token/not-valid", "Messaging token is not valid");
    if(!token.trim()) throw new CustomError("messaging-token/not-valid", "Messaging token is not valid");
    this.token = token;
    this.owner = owner;
  }

  get owner(){ return this._owner };
  set owner(value){
    if(typeof(value) !== "object") throw new CustomError("messaging-token/programmer", "Ops! something went wrong");
    if(typeof(value) === "object" && !(value instanceof User)) throw new CustomError("messaging-token/programmer", "Ops! something went wrong");
    this._owner = value;
  }
}