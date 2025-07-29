"use server";

import Role from "@/models/role";
import dbConnect from "../../lib/mongodb";
import User from "../../models/user";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  switch (method) {
    case "GET":
      try {
        const user = await User.find({});
        const userWithRole = await Promise.all(
          user.map(async (ele) => {
            const role = await Role.findById({
              _id: ele.role_id,
            });

            return {
              user: ele.toJSON(), // Use the custom toJSON method
              role: role ? role.toJSON() : null, // Ensure product is in the desired format
            };
          })
        );
        res.status(200).json({ success: true, data: userWithRole });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      const body = req.body;
      try {
        console.log("inside api", body);
        const user = await User.create(JSON.parse(req.body));
        await user.save();
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
