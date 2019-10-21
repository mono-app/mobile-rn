import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";

export default class User extends Model{
  static table = "users";

  @field("email") email
  @field("is_complete_setup") isCompleteSetup
  @field("is_login") isLogin
  @date("created_at") createdAt
  @date("updated_at") updatedAt
}