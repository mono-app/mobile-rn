import { Model } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation } from "@nozbe/watermelondb/decorators";

export default class PhoneNumber extends Model{
  static table = "phone_numbers";

  @field("is_verified") isVerified
  @field("number") number
  @immutableRelation("users", "user_id") user
  @readonly @date("created_at") createdAt
  @readonly @date("updated_at") updatedAt
}