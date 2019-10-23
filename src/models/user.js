import { Model } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation } from "@nozbe/watermelondb/decorators";

export default class User extends Model{
  static table = "users";

  @field("email") email
  @field("is_complete_setup") isCompleteSetup
  @field("is_login") isLogin
  @immutableRelation("application_informations", "application_information_id") applicationInformation
  @immutableRelation("personal_informations", "personal_information_id") personalInformation
  @immutableRelation("profile_pictures", "profile_picture_id") profilePicture
  @immutableRelation("phone_numbers", "phone_number_id") phoneNumber
  @readonly @date("created_at") createdAt
  @readonly  @date("updated_at") updatedAt
}