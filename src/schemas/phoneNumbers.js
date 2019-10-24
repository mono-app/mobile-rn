import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: "phone_numbers",
  columns: [
    { name: "is_verified", type: "boolean" },
    { name: "number", type: "string" },
    { name: "user_id", type: "string", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" }
  ]
})