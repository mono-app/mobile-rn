import { Model } from "@nozbe/watermelondb";
import { field, date, relation } from "@nozbe/watermelondb/decorators";

export default class User extends Model{
  static table = "users";

  @field("email") email
  @field("is_complete_setup") isCompleteSetup
  @field("is_login") isLogin
  @relation("application_informations", "application_information_id") applicationInformation
  @relation("personal_informations", "personal_information_id") personalInformation
  @relation("profile_pictures", "profile_picture_id") profilePicture
  @relation("phone_numbers", "phone_number_id") phoneNumber
  @date("created_at") createdAt
  @date("updated_at") updatedAt
}