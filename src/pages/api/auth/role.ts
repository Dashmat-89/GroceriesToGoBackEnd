"use server";

import dbConnect from "@/lib/mongodb";
import Role from "@/models/role";
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
        const user = await Role.find({});
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      const { role_name } = req.body;
      try {
        console.log("inside api", role_name);
        const user = await Role.create({ role_name });
        // await user.save();
        res.status(201).json({ success: true, data: { role_name } });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
