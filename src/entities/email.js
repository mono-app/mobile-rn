import CustomError from "src/entities/error";

export default class Email{
  // address: string

  /**
   * 
   * @param {string} address 
   */
  constructor(address){
    if(!address) throw new CustomError("email/not-valid", "Email address is not valid");
    else if(!address.trim()) throw new CustomError("email/not-valid", "Email address is not valid");
    else if(isInvalidAddress(address)) throw new CustomError("email/not-valid", "Email address is not valid");
    else this.address = address.toLowerCase();;
  }
}

function isInvalidAddress(address){
  const validEmailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return !validEmailRegex.test(address);
}
