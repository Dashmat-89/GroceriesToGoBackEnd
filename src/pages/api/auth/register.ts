"use server";

import dbConnect from "@/lib/mongodb";
import Role from "@/models/role";
import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const user = await User.find({});
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      const {
        // role_id,
        username,
        password,
        email,
        first_name,
        last_name,
        phone_number,
        // status,
      } = JSON.parse(req.body);
      try {
        const role = await Role.create({ role_name: "staff" });

        // console.log("inside api", username, password);
        const user = await User.create({
          role_id: role._id,
          username,
          password,
          email,
          first_name,
          last_name,
          phone_number,
          status: false,
        });
        // await user.save();
        console.log(user);
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
