import { addCartItem, getCartItems, removeCartItem } from "@/models";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");

  if (req.method === "GET") {
    const cart = await getCartItems();
    res.status(200).json(cart);
  } else if (req.method === "POST") {
    const item = await addCartItem(req.query.id);
    res.status(201).json(item);
  } else if (req.method === "DELETE") {
    const item = await removeCartItem(req.query.id);

    if (item == null) {
      res.status(404).json({ message: "404 Not Found" });
    }

    res.status(201).json(item);
  } else if (req.method === "OPTIONS") {
    res.send();
  }
}
