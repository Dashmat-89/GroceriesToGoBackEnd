"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Receipt from "@/models/receipt";
import OrderedItem from "@/models/orderedItem";
import Product from "@/models/product";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { slug } = req.query;
        // Fetch all ordered items
        const orderedItems = await OrderedItem.find().where({ order_id: slug });

        // Use Promise.all to fetch products for each ordered item
        const itemsWithProducts = await Promise.all(
          orderedItems.map(async (item) => {
            const product = await Product.findById({
              _id: item.product_id,
            });

            return {
              item: item.toJSON(), // Use the custom toJSON method
              product: product ? product.toJSON() : null, // Ensure product is in the desired format
            };
          })
        );

        // Fetch receipts if needed (assuming you want to include them)
        const receipts = await Receipt.find().where({ order_id: slug });

        // Send the response
        res.status(200).json({
          success: true,
          // data: { itemsWithProducts },
          data: {
            receipts,
            items: itemsWithProducts,
            timeStamp: receipts.createdAt,
          },
        });

        // console.log(products);
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      const body = req.body;

      try {
        res.status(201).json({ success: true, data: "Does not accept post" });
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
