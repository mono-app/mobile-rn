import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: "profile_pictures",
  columns: [
    { name: "download_url", type: "string" },
    { name: "storage_path", type: "string" },
    { name: "user_id", type: "string", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" }
  ]
})