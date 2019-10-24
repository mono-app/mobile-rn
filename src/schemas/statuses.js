import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: "statuses", 
  columns: [
    { name: "content", type: "string" },
    { name: "user_id", type: "string", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" }
  ]
});