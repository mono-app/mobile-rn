import { Model } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation, action } from "@nozbe/watermelondb/decorators";

export default class ProfilePicture extends Model{
  static table = "profile_pictures";

  @field("download_url") downloadUrl
  @field("storage_path") storagePath
  @immutableRelation("users", "user_id") user
  @readonly @date("created_at") createdAt
  @readonly @date("updated_at") updatedAt

  @action async changeProfilePicture(downloadUrl, storagePath){
    await this.update((profilePicture) => {
      profilePicture.downloadUrl = downloadUrl;
      profilePicture.storagePath = storagePath;
    })
  }
}