import { Model } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation } from "@nozbe/watermelondb/decorators";

export default class PersonalInformation extends Model{
  static table = "personal_informations";

  @field("birthday") birthday
  @field("family_name") familyName
  @field("given_name") givenName
  @field("gender") gender
  @immutableRelation("users", "user_id") user
  @readonly @date("created_at") createdAt
  @readonly @date("updated_at") updatedAt
}