"use server";

import Role from "@/models/role";
import dbConnect from "../../lib/mongodb";
import User from "../../models/user";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
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
        console.log("inside api", body.email);
        const existingUserwithEmail = await User.findOne({
          email: body.email,
        });

        res.status(201).json({ success: true, data: existingUserwithEmail });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
