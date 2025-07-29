"use server";

import dbConnect from "@/lib/mongodb";
import OrderedItem from "@/models/orderedItem";

export default async function handler(req, res) {
  await dbConnect();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const ordered_Item = await OrderedItem.find({});
        res.status(200).json({ success: true, data: ordered_Item });
      } catch (error) {
        console.error("Error fetching products:", error);
        res
          .status(400)
          .json({ success: false, message: "Error fetching products" });
      }
      break;

    case "POST":
      const body = req.body;

      try {
        console.log("Inside API", body);

        // Create the product
        const ordered_Item = await OrderedItem.create(body);

        // No need to call product.save() as create() already saves the document
        res.status(201).json({ success: true, data: ordered_Item });
      } catch (error) {
        console.error("Error creating ordered Item:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
