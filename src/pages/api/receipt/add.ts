"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Receipt from "@/models/receipt";
import OrderedItem from "@/models/orderedItem";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const receipts = await Receipt.find({});

        res.status(200).json({
          success: true,
          data: { receipts: receipts },
        });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      const body = req.body;

      try {
        // Create the product
        const receipt = await Receipt.create(body);

        // No need to call receipt.save() as create() already saves the document

        res.status(201).json({ success: true, data: receipt });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
