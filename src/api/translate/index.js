export default class TranslateAPI{
  static translate(words, toLanguage){
    words = words.replace("hours", "jam");
    words = words.replace("hour", "jam");
    words = words.replace("ago", "yang lalu");
    words = words.replace("minutes", "menit");
    words = words.replace("minute", "menit");
    words = words.replace("days", "hari");
    words = words.replace("day", "hari");
    return words;
  }
}