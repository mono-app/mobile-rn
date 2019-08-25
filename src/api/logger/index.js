import { STAGE } from "react-native-dotenv";

class Logger{
  static log(message){
    if(STAGE === "DEVELOPMENT") console.log(message);
  }
}
export default Logger;