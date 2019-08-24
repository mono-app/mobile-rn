import { STAGE } from "react-native-dotenv";

class Logger{
  static log(message){
    if(STAGE === "development") console.log(message);
  }
}
export default Logger;