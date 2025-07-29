import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role_id: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    phone_number: { type: String },
    status: { type: Boolean },
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;

// export async function getAllUsers() {
//   const users = await User.find({}).exec();
//   console.log(users);
//   return users;
// }

// export async function getUser(id) {
//   const user = await User.findById(id).exec();
//   return user;
// }
