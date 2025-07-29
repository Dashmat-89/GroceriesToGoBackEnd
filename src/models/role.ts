import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    role_name: { type: String },
  },
  { timestamps: true }
);

const Role = mongoose.models.roles || mongoose.model("roles", RoleSchema);

export default Role;
