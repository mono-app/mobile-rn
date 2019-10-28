import { Model, Q } from "@nozbe/watermelondb";
import { readonly, field, date, immutableRelation, children, action, lazy } from "@nozbe/watermelondb/decorators";

export default class User extends Model{
  static table = "users";
  static associations = {
    statuses: { type: "has_many", foreignKey: "user_id" }
  }

  @field("email") email
  @field("is_complete_setup") isCompleteSetup
  @immutableRelation("application_informations", "application_information_id") applicationInformation
  @immutableRelation("personal_informations", "personal_information_id") personalInformation
  @immutableRelation("profile_pictures", "profile_picture_id") profilePicture
  @immutableRelation("phone_numbers", "phone_number_id") phoneNumber
  @children("statuses") statuses
  @readonly @date("created_at") createdAt
  @readonly  @date("updated_at") updatedAt

  @lazy friends = this.collection.get("users").query(Q.on("friends", "following_user_id", this.id));

  @action async getLatestStatus(){
    const statuses = await this.statuses.fetch();
    if(statuses.length === 0) return null;
    const sortedStatus = statuses.sort((first, second) => {
      if(first.createdAt > second.createdAt) return 1
      else if(first.createdAt < second.createdAt) return -1
      else return 0;
    });
    const [ status ] = sortedStatus;
    return status;
  }
}