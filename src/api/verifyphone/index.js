
export default class VerifyPhoneAPI{

  static async sendCode(phoneNumber){
    try {
      const response = await fetch(
        "https://api.nexmo.com/verify/json?"+
        "api_key=041a29a4"+
        "&api_secret=rhVzsq1SLQnzmeJB"+
        "&number="+phoneNumber+
        "&brand=Mono"+
        "&workflow_id=4"+
        "&code_length=4",
      );
      const responseJson = await response.json();

      if(responseJson && responseJson.status==="0"){
        const otpRequestId = responseJson.request_id
        return Promise.resolve(otpRequestId);
      }
        
      return Promise.resolve(false);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  }

  static async checkCode(otpRequestId, code){
    try {
      const response = await fetch("https://api.nexmo.com/verify/check/json"+
      "?api_key=041a29a4"+
      "&api_secret=rhVzsq1SLQnzmeJB"+
      "&request_id="+otpRequestId+
      "&code="+code
      );
      const responseJson = await response.json();

      if(responseJson && responseJson.status==="0"){
        return Promise.resolve(true);
      }
        
      return Promise.resolve(false);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  }

}