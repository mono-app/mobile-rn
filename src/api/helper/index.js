import uuid from "uuid/v4"

export default class HelperAPI{

  static validateEmail(email){
    var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email)
      return false;
      
    if(email.length>254)
      return false;

    var valid = tester.test(email);
    if(!valid)
      return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
      return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
      return false;

    return true;
  }

  static getDefaultProfilePic(){
    return "https://api.adorable.io/avatars/285/"+uuid()+".png"
  }

  static getClassroomLogo(){
    return "https://firebasestorage.googleapis.com/v0/b/chat-app-fdf76.appspot.com/o/main%2Flogo%2Flogoclassroom.png?alt=media&token=f472a571-24c3-4bfa-8c44-e5f9417b7114"
  }
}