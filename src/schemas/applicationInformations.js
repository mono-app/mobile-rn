import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: "application_informations",
  columns: [
    { name: "mono_id", type: "string" },
    { name: "nick_name", type: "string" },
    { name: "user_id", type: "string", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" }
  ]
})