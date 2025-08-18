export const CategorySchema = {
  name: "Category",
  primaryKey: "id",
  properties: {
    id: "string",
    name: "string",
    parentId: "string",
    totalProduct: "number",
    createdAt: "date",
    updatedAt: "date",
  },
};
