"use server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";

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
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      const body = JSON.parse(req.body);
      try {
        console.log(body.id);
        const user = await User.findByIdAndDelete(body.id);
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
