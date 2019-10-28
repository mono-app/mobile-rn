import { Model } from "@nozbe/watermelondb";
import { readonly, field, date } from "@nozbe/watermelondb/decorators";


export default class Friend extends Model{
  static table = "friends";
  static associations = {
    users: { type: "belongs_to", key: "following_user_id" },
    users: { type: "belongs_to", key: "follower_user_id" }
  }

  @field("following_user_id") followingUserId;
  @field("follower_user_id") folowerUserId;
  @readonly @date("created_at") createdAt;
  @readonly @date("updated_at") updatedAt;
}