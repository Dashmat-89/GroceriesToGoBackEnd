import dbConnect from "@/lib/mongodb";
import OrderedItem from "@/models/orderedItem";
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
        const orders = await OrderedItem.find({});
        const productname = await Promise.all(
          orders.map(async (ele) => {
            const productInfo = await Product.findById({
              _id: ele.product_id,
            });

            return {
              orderInfo: ele.toJSON(), // Use the custom toJSON method
              productInfo: productInfo ? productInfo.toJSON() : null, // Ensure product is in the desired format
            };
          })
        );
        res.status(200).json({ success: true, data: productname });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      const body = req.body;
      try {
        console.log("inside api", body);

        res.status(201).json({ success: true, Product: {} });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
