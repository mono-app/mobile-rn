import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: "friends",
  columns: [
    { name: "following_user_id", type: "string" },
    { name: "follower_user_idid", type: "string" },
    { name: "source", type: "string" },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" }
  ]
})