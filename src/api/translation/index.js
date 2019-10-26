import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationId from "src/api/translation/id"
import translationEn from "src/api/translation/en"

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
  }

  static changeLanguage(newLanguage){
    // simpan ke async
    // bla bla bla

    TranslationAPI.deviceLangauge = newLanguage;
  }

  static get deviceLanguage(){ return TranslationAPI._deviceLanguage }
  static set deviceLangauge(value){ 
    TranslationAPI._deviceLanguage = value 
    TranslationAPI.initialize();
  }

  // NOTE: this is async
  static get t(){
    return (async () => {
      if(!TranslationAPI._t)  await Translation.initialize();
      return TranslationAPI._t;
    })
  }
}
export default TranslationAPI;