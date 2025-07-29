"use server";
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/lib/mongodb";
import Product from "@/models/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const products = await Product.find({});
        let lowStocksItem = 0;
        let totalSum = 0;
        let totalStockQnt = 0;

        for (let i = 0; i < products.length; i++) {
          totalStockQnt += products[i].stock_quantity;
        }

        totalSum = products.reduce(function add(prev, curr) {
          return prev + curr.cost_price;
        }, 0);
        console.log(totalSum);

        products.filter((product) => {
          product.stock_quantity < product.reorder_stock_level &&
            lowStocksItem++;
        });
        res.status(200).json({
          success: true,
          data: { products, lowStocksItem, totalSum, totalStockQnt },
        });
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
        const product = await Product.create(body);

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
