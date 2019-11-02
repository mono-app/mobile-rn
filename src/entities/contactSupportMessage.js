import Email from "./email";
import CustomError from "./error";
import Name from "./name";

export default class ContactSupportMessage{
  // monoId: string
  // _email: Email
  // _name: Name
  // _description: string

  /**
   * 
   * @param {string} monoId 
   * @param {Email} email 
   * @param {string} name 
   * @param {string} description 
   */
  constructor(monoId, email, name, description){
    this.monoId = monoId
    this.email = email
    this.name = name
    this.description = description
  }

  get email() { return this._email.address }
  set email(value) { 
    if(value.trim().length===0) throw new CustomError("contact-support/empty-email", "Email cannot be empty")
    this._email = new Email(value) 
  }
  
  get name() { return this._name.value }
  set name(value) { 
    if(value.trim().length===0) throw new CustomError("contact-support/empty-name", "Name cannot be empty")
    this._name = new Name(value) 
  }

  get description() { return this._description }
  set description(value) { 
    if(value.trim().length===0) throw new CustomError("contact-support/empty-desc", "Description cannot be empty")
    this._description = value
  }
  
  get data(){
    const transformedData = {}
    Object.keys(this).map((prop) => {
      const newProp = (prop.indexOf("_") === 0)? prop.substring(1): prop;
      transformedData[newProp] = this[newProp];
    })
    return transformedData;
  }


}