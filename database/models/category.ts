export const CategorySchema = {
  name: "Category",
  primaryKey: "id",
  properties: {
    id: "string",
    name: "string",
    parentId: "string",
    userId: "number",
    type: "string",
    createdAt: "date",
    updatedAt: "date",
  },
};
