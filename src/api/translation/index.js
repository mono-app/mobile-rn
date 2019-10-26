import { AsyncStorage } from "react-native";

class TranslationAPI{
  static _t = null;
  static _deviceLanguage = null;

  static async initialize(){
    const languageDetector = {
      type: 'languageDetector',
      async: true,
      detect: cb => cb(TranslationAPI.deviceLanguage),
      init: () => {},
      cacheUserLanguage: () => {},
    };

    TranslationAPI._t = await i18next.use(languageDetector).init({
      fallbackLng: 'en_US',
      debug: true,
      resources: {
        en_US: { translation: translationEn },
        in_ID: { translation: translationId },
      },
    });
  }

  static changeLanguage(newLanguage){
    // simpan ke async
    // bla bla bla

    TranslationAPI.deviceLangauge = newLanguage;
  }

  static set deviceLangauge(value){ 
    TranslationAPI._deviceLanguage = value 
    TranslationAPI.initialize();
  }

  static get deviceLanguage(){ return TranslationAPI._deviceLanguage }
  static get t(){
    if(!TranslationAPI._t)  await Translation.initialize();
    return TranslationAPI._t;
  }
}
export default TranslationAPI;