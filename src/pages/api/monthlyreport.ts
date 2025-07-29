
import dbConnect from "../../lib/mongodb";
import Product from "../../models/product";


export default async function handler(req:any, res:any) {
    await dbConnect();
    // res.setHeader("Access-Control-Allow-Origin", "*")
    // res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    // res.setHeader("Access-Control-Allow-Headers", "*");

    try {
        const result = await Product.aggregate ( [
            {$group: {_id: '$category', count: {$sum: 1}}}
        ]);

        const formatted = result.map(item => ({
            category: item._id || "Uncategorized",
            count: item.count
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error("Error fetching category count:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}