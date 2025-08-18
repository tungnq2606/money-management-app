export const ProductSchema = {
  name: "Product",
  primaryKey: "id",
  properties: {
    id: "string",
    name: "string",
    shopId: "string",
    price: "number",
    description: "string",
    image: "string",
    stock: "number",
    sell: "number",
    catId: "string",
    brandId: "string",
    createdAt: "date",
    updatedAt: "date",
  },
};
