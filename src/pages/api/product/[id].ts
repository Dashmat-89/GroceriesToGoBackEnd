import {
  deleteCartItem,
  deleteProduct,
  getProductDetails,
  updateProduct,
} from "@/models";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "GET") {
    const product = await getProductDetails(req.query.id);
    if (product === null) {
      res.status(404).json({ message: "404 Not Found" });
      return;
    }
    res.status(200).json(product);
  } else if (req.method === "DELETE") {
    await deleteProduct(req.query.id);
    await deleteCartItem(req.query.id);
    res.status(204).json({ message: "Delete Successful" });
  } else if (req.method === "PUT") {
    const product = await updateProduct(req.query.id, req.body);
    res.status(201).json(product);
  } else if (req.method === "OPTIONS") {
    res.send();
  }
}
