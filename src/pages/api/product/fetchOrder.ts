"use server";
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/lib/mongodb";
import Product from "@/models/product";
import { Query, trusted } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        let products;
        if (query.category) {
          const category = query.category;
          if (category === "all") {
            products = await Product.find({});
          } else {
            products = await Product.find({ category });
          }
        } else {
          products = await Product.find({});
        }

        // const products = await Product.find({});

        let lowStocksItem = 0;
        products.filter((product) => {
          product.stock_quantity < product.reorder_stock_level &&
            lowStocksItem++;
        });
        res
          .status(200)
          .json({ success: true, data: { products, lowStocksItem } });
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
        const product = await Product.create(body);

        // No need to call product.save() as create() already saves the document
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const { stock_quantity, product_id } = JSON.parse(req.body);
        console.log(product_id, stock_quantity);
        // const product = await Product.findOne({product_id:id})
        const updatedProduct = await Product.findOneAndUpdate(
          { product_id: product_id },
          { stock_quantity }
        );
        // if(!updatedProduct){
        //   return res.status(404).json({message:"Product not found"});
        // }
        res.status(200).json({ data: [updatedProduct] });
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
