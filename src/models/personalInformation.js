import { Model } from "@nozbe/watermelondb";
import { field, date, relation } from "@nozbe/watermelondb/decorators";

export default class PersonalInformation extends Model{
  static table = "personal_informations";

  @field("birthday") birthday
  @field("family_name") familyName
  @field("given_name") givenName
  @field("gender") gender
  @relation("users", "user_id") user
  @date("created_at") createdAt
  @date("updated_at") updatedAt
}