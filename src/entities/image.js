export default class Image{

  constructor(downloadUrl, storagePath){
    this.downloadUrl = downloadUrl
    this.storagePath = storagePath
  }

  get downloadUrl() { return this._downloadUrl }
  set downloadUrl(value) { this._downloadUrl = value }

  get storagePath() { return this._storagePath }
  set storagePath(value) { this._storagePath = value }
  
}