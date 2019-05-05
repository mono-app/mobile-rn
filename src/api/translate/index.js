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

  static shortTime(words){
    words = words.replace("hours", "j");
    words = words.replace("hour", "j");
    words = words.replace("ago", "");
    words = words.replace("minutes", "m");
    words = words.replace("minute", "m");
    words = words.replace("days", "h");
    words = words.replace("day", "h");
    words = words.replace(/ /g,'');
    return words;
  }
}