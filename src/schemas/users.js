import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: "users", 
  columns: [
    { name: "email", type: "string" },
    { name: "is_complete_setup", type: "boolean" },
    { name: "is_login", type: "boolean" },
    { name: "application_information_id", type: "string" },
    { name: "personal_information_id", type: "string" },
    { name: "profile_picture_id", type: "string" },
    { name: "phone_number_id", type: "string" },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" }
  ]
});