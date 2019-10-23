import { Model } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation } from "@nozbe/watermelondb/decorators";

export default class ApplicationInformation extends Model{
  static table = "application_informations";
  
  @field("mono_id") monoId
  @field("nick_name") nickName
  @immutableRelation("users", "user_id") user
  @readonly @date("created_at") createdAt
  @readonly @date("updated_at") updatedAt
}