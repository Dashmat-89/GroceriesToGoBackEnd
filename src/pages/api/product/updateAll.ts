import { addProduct, getAllProducts, updateProduct } from "@/models";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "GET") {
    const products = await getAllProducts();
    res.status(200).json(products);
  } else if (req.method === "POST") {
    const body = req.body;
    const updatedProduct = await updateProduct(body._id, body);
    res.status(201).json({ success: true, data: updatedProduct });
  } else if (req.method === "OPTIONS") {
    res.send();
  }
}
