import { EntitySchema } from "typeorm";

import { Document } from "src/api/database/models";

export const DocumentSchema = new EntitySchema({
  name: "Document", target: Document,
  columns: {
    id: { type: "varchar", primary: true },
    collection: { type: "varchar", primary: true },
    jsonValue: { type: "varchar" }
  }
});