import { Model } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation } from "@nozbe/watermelondb/decorators";

export default class Status extends Model{
  static table = "statuses";

  @field("content") content
  @immutableRelation("users", "user_id") user
  @readonly @date("created_at") createdAt
  @readonly @date("updated_at") updatedAt
}