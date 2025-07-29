"use server";

import Role from "@/models/role";
import dbConnect from "../../lib/mongodb";
import User from "../../models/user";

export default async function handler(req, res) {
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
      const body = JSON.parse(req.body);
      try {
        console.log("inside api", body.username);
        const existingUser = await User.findOne({ username: body.username });

        res.status(201).json({ success: true, data: existingUser });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
