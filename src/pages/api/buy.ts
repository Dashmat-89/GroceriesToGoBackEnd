import { addCartItemstoOrders } from "@/models";
import CartItems from "@/models/CartItems";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  // res.setHeader("Access-Control-Allow-Origin", "*");

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const user = await CartItems.find({});
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      const {
        user_email,
        order_id,
        subtotal,
        quantity,
        tax_cost,
        payment_method,
        phone_number,
        received_by,
      } = JSON.parse(req.body);
      try {
        // console.log("inside api", req.body);
        const response = await addCartItemstoOrders({
          payment_method,
          phone_number,
          received_by,
          user_email,
          order_id,
          subtotal,
          quantity,
          tax_cost,
        });
        console.log(response);
        res.status(201).json({ success: true, data: { response } });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
