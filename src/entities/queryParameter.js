import CustomError from "src/entities/error";

export default class QueryParameter{
  /**
   * 
   * @param {string} parameters 
   */
  constructor(parameters){
    this.parameters = parameters;
  }

  get encoded(){
    if(!this.parameters) throw new CustomError("query-parameter/not-valid", "The parameter is not valid");
    if(typeof(this.parameters) !== "object") throw new CustomError("query-parameter/not-object", "The parameter must be object");
    return Object.entries(params).map((key) => key.map(encodeURIComponent).join("=")).join("&");
  }
}