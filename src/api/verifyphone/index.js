import firebase from "react-native-firebase";
import PhoneNumber from "src/entities/phoneNumber";
import QueryParameter from "src/entities/queryParameter";
import CustomError from "src/entities/error";
import Otp from "src/entities/otp";
import { UserCollection } from "src/api/database/collection";
import { NEXMO_API_KEY, NEXMO_API_SECRET } from "react-native-dotenv";
import Database from "../database";

export default class VerifyPhoneAPI{
  static currentNexmoRequestId = null

  /**
   * @param {PhoneNumber} phoneNumber 
   * @param {boolean} skip
   */
  static async sendCode(phoneNumber, skip=false){
    if(skip) return Promise.resolve({ requestId: "MONO" });

    const params = new QueryParameter({
      api_key: NEXMO_API_KEY, api_secret: NEXMO_API_SECRET,
      number: phoneNumber.number, brand: "Mono", workflow_id: 4,
      code_length: 4
    });
    const response = await fetch(`https://api.nexmo.com/verify/json?${params.encoded}`);
    const responseJson = await response.json();

    if(responseJson && responseJson.status === "0"){
      return Promise.resolve({ requestId: responseJson.request_id });
    }else throw new CustomError("verify/unknown", "An unknown error has occured");
  }

  /**
   * 
   * @param {string} requestId 
   * @param {Otp} otp 
   * @param {boolean} skip 
   */
  static async checkCode(requestId, otp, skip=false){
    if(skip) return Promise.resolve(true);

    const params = new QueryParameter({ 
      api_key: NEXMO_API_KEY, api_secret: NEXMO_API_SECRET, request_id: requestId, code: otp.code 
    });
    const response = await fetch(`https://api.nexmo.com/verify/check/json?${params.encoded}`);
    const responseJson = await response.json();
    if(responseJson && responseJson.status==="0") return Promise.resolve(true);
    else if(responseJson && responseJson.status==="16") throw new CustomError("verify/incorrect-otp", "Provided otp is not correct");
    else if(responseJson && responseJson.status==="17") throw new CustomError("verify/wrong-many-times", "You input wrong code many times");
    else if(responseJson && responseJson.status==="6") throw new CustomError("verify/unable-process", "Unable to process request, please re sign up");
    else if(responseJson) throw new CustomError("verify/unknown-code", "An unknown error has occured errCode:"+responseJson.status);
    throw new CustomError("verify/unknown", "An unknown error has occured");
  }

  /**
   * 
   * @param {string} requestId 
   */
  static async cancelRequest(requestId){
    const params = new QueryParameter({ 
      api_key: NEXMO_API_SECRET, api_secret: NEXMO_API_SECRET, request_id: requestId, cmd: "cancel" 
    });
    await fetch(`https://api.nexmo.com/verify/control/json?${params.encoded}`);
  }

  static async isAvailable(phone){
    let isAvailable = true
    await Database.get(async(db)=>{
      const usersCollection = new UserCollection();
      const userRef = db.collection(usersCollection.getName()).where('phoneNumber.value','==',phone)
      const userQuerySnapshot = await userRef.get()
      if(!userQuerySnapshot.empty) isAvailable = false
    }, true)
    return Promise.resolve(isAvailable)
  }

}