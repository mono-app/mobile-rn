import { Model } from "@nozbe/watermelondb";
import { field, date, relation } from "@nozbe/watermelondb/decorators";

export default class ApplicationInformation extends Model{
  static table = "application_informations";
  
  @field("mono_id") monoId
  @field("nick_name") nickName
  @relation("users", "user_id") user
  @date("created_at") createdAt
  @date("updated_at") updatedAt
}