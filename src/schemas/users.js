import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: "users", 
  columns: [
    { name: "email", type: "string" },
    { name: "is_complete_setup", type: "boolean" },
    { name: "is_login", type: "boolean" },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" }
  ]
});