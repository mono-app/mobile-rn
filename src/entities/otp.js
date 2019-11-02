import CustomError from "src/entities/error";

export default class Otp{  
  // code: string

  /**
   * 
   * @param {string} code 
   */
  constructor(code){
    if(!code) throw new CustomError("otp/empty-code", "Code cannot be empty");
    if(!code.trim()) throw new CustomError("otp/empty-code", "Code cannot be empty");
    this.code = code;
  }
}