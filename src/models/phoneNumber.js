import { Model } from "@nozbe/watermelondb";
import { field, date, relation } from "@nozbe/watermelondb/decorators";

export default class PhoneNumber extends Model{
  static table = "phone_numbers";

  @field("is_verified") isVerified
  @field("number") number
  @relation("users", "user_id") user
  @date("created_at") createdAt
  @date("updated_at") updatedAt
}