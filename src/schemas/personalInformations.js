import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: "personal_informations",
  columns: [
    { name: "birthday", type: "string" },
    { name: "family_name", type: "string" },
    { name: "given_name", type: "string" },
    { name: "gender", type: "string" },
    { name: "user_id", type: "string", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" }
  ]
})