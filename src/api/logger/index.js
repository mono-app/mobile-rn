import { STAGE } from "react-native-dotenv";

class Logger{
  static log(tag, message){
    if(STAGE === "DEVELOPMENT") console.log(tag, message);
  }
}
export default Logger;