"use server";

import dbConnect from "@/lib/mongodb";
import Product from "@/models/product";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  switch (method) {
    case "GET":
      try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
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
        // Validate the incoming data
        // if (!body.username || !body.password || !body.email) {
        //   return res
        //     .status(400)
        //     .json({ success: false, message: "Missing required fields" });
        // }

        console.log("Inside API", body);

        // Create the product
        const product = await Product.create(JSON.parse(body));

        // No need to call product.save() as create() already saves the document
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
