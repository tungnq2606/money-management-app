export const UserSchema = {
  name: "User",
  primaryKey: "id",
  properties: {
    id: "string",
    name: "string",
    email: "string",
    role: "bool",
    phone: "number",
  },
};
