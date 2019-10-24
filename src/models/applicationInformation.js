import { Model } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation, action } from "@nozbe/watermelondb/decorators";

export default class ApplicationInformation extends Model{
  static table = "application_informations";
  
  @readonly @field("mono_id") monoId
  @field("nick_name") nickName
  @immutableRelation("users", "user_id") user
  @readonly @date("created_at") createdAt
  @readonly @date("updated_at") updatedAt

  @action async updateNickName(newNickName){
    await this.update((applicationInformation) => applicationInformation.nickName = newNickName)
  }
}