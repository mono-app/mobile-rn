import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import translationId from "src/api/translation/id"
import translationEn from "src/api/translation/en"
import Key from 'src/helper/key';

class TranslationAPI{
  static _t = null;
  static _deviceLanguage = "in_ID";

  static async initialize(){
    const languageDetector = {
      type: 'languageDetector',
      async: true,
      detect: cb => cb(TranslationAPI.deviceLanguage),
      init: () => {},
      cacheUserLanguage: () => {},
    };

    TranslationAPI._t = await i18next.use(languageDetector).use(initReactI18next).init({
      fallbackLng: 'en_US',
      debug: true,
      resources: {
        en_US: { translation: translationEn },
        in_ID: { translation: translationId },
      },
    });

    const lang = await AsyncStorage.getItem(Key.KEY_APP_LANGUAGE)
    if(lang && lang!==TranslationAPI.deviceLanguage) TranslationAPI.deviceLanguage = lang
  }

  static changeLanguage(newLanguage){
    // simpan ke async
    // bla bla bla
    AsyncStorage.setItem(Key.KEY_APP_LANGUAGE, newLanguage)
    TranslationAPI.deviceLanguage = newLanguage;
  }

  static get deviceLanguage(){ return TranslationAPI._deviceLanguage }
  static set deviceLanguage(value){ 
    TranslationAPI._deviceLanguage = value 
    TranslationAPI.initialize();
  }

  // NOTE: this is async
  static get t(){
    return (async () => {
      if(!TranslationAPI._t)  await TranslationAPI.initialize();
      return TranslationAPI._t;
    })
  }
}
export default TranslationAPI;