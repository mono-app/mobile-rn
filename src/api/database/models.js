export class BaseModel{
  constructor(data){ Object.assign(this, data); }
}

export class User{
  constructor(monoId, email, nickName, profilePicture){
    this.monoId = monoId;
    this.email = email;
    this.nickName = nickName;
    this.profilePicture = profilePicture;
  }
}