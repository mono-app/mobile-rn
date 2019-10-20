import { EntitySchema } from "typeorm";

import { User } from "src/api/database/models";

export const UserSchema = new EntitySchema({
  name: "User", target: User,
  columns: {
    email: { type: "varchar", primary: true },
    nickName: { type: "varchar" },
    profilePicture: { type: "varchar", nullable: true }
  }
});