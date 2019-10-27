import CustomError from "src/entities/error";

export default class ApplicationInformation{
  // _monoId: string
  // _nickName: string

  /**
   * 
   * @param {string} monoId 
   * @param {string} nickName 
   */
  constructor(monoId, nickName){
    this.monoId = monoId;
    this.nickName = nickName;
  }

  get monoId(){ return this._monoId; }
  set monoId(value){ 
    if(!value) throw new CustomError("application-information/mono-id-not-valid", "Mono ID is not valid"); 
    if(!value.trim()) throw new CustomError("application-information/mono-id-not-valid", "Mono ID is not valid");
    if(isInvalidMonoId(value)) throw new CustomError("application-information/mono-id-not-valid", "Mono ID is not valid");
    this._monoId = value.toLowerCase().trim(); 
  }

  get nickName(){ return this._nickName; }
  set nickName(value){
    if(!value) throw new CustomError("application-information/nick-name-not-valid", "Nickname is not valid");
    if(!value.trim()) throw new CustomError("application-information/nick-name-not-valid", "Nickname is not valid");
    this._nickName = value;
  }

  get data(){
    const transformedData = {}
    Object.keys(this).map((prop) => {
      const newProp = (prop.indexOf("_") === 0)? prop.substring(1): prop;
      transformedData[newProp] = this[prop];
    })
    return transformedData;
  }
}

function isInvalidMonoId(monoId){
  const validMonoIdRegex = /[^a-zA-Z0-9_.]/gi;
  return validMonoIdRegex.test(monoId);
}
