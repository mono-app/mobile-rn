export default class Class_{

  constructor(subject, semester, room, academicYear, isArchive){
    this.subject = subject
    this.semester = semester
    this.room = room
    this.academicYear = academicYear
    this.isArchive = isArchive
  }

  get subject() { return this._subject }
  set subject(value) { this._subject = value }

  get semester() { return this._semester }
  set semester(value) { this._semester = value }
  
  get room() { return this._room }
  set room(value) { this._room = value }
  
  get academicYear() { return this._academicYear }
  set academicYear(value) { this._academicYear = value }
  
  get isArchive() { return this._isArchive }
  set isArchive(value) { this._isArchive = value }
  



}