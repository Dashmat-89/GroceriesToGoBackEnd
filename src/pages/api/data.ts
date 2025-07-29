import dbConnect from "../../lib/mongodb";
import Product from "../../models/product";


export default async function handler(req:any, res:any) {
    await dbConnect();
    // Set CORS headers for all requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    
    const p = await Product.find({}).exec()
    res.status(200).json(p)
  }