import CustomError from "src/entities/error";

export default class Email{
  // address: string

  constructor(address){
    if(isInvalidAddress) throw new CustomError("email/not-valid", "Email address is not valid");
    else{
      this.address = address;
    }
  }
}

function isInvalidAddress(address){
  const validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !validEmailRegex.test(address);
}
