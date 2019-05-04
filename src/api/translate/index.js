export default class TranslateAPI{
  static translate(words, toLanguage){
    words = words.replace("hours", "jam");
    words = words.replace("hour", "jam");
    words = words.replace("ago", "yang lalu");
    words = words.replace("minutes", "menit");
    words = words.replace("minute", "menit");
    return words;
  }
}