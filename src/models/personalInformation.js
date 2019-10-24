import { Model } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation, action } from "@nozbe/watermelondb/decorators";

export default class PersonalInformation extends Model{
  static table = "personal_informations";

  @field("birthday") birthday
  @field("family_name") familyName
  @field("given_name") givenName
  @field("gender") gender
  @immutableRelation("users", "user_id") user
  @readonly @date("created_at") createdAt
  @readonly @date("updated_at") updatedAt

  @action async updateGender(value){
    await this.update((personalInformation) => personalInformation.gender = value);
  }

  @action async updateBirthday(value){
    await this.update((personalInformation) => personalInformation.birthday = value);
  }
}