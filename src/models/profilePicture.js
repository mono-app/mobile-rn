import { Model } from "@nozbe/watermelondb";
import { field, date, relation } from "@nozbe/watermelondb/decorators";

export default class ProfilePicture extends Model{
  static table = "profile_pictures";

  @field("download_url") downloadUrl
  @field("storage_path") storagePath
  @relation("users", "user_id") user
  @date("created_at") createdAt
  @date("updated_at") updatedAt
}