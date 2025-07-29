import mongoose from "mongoose";
// const product = new mongoose.Schema({ name: String });
const mongooseSequence = require("mongoose-sequence");

const ProductSchema = new mongoose.Schema(
  {
    // product_id: { type: mongoose.Schema.ObjectId },
    image_url: { type: String },
    product_name: { type: String },
    description: { type: String },
    category: { type: String },
    cost_price: { type: Number },
    tax_rate: { type: Number },
    stock_quantity: { type: Number },
    reorder_stock_level: { type: Number },
    lifespan: { type: Number },
  },
  { timestamps: true }
);
// if (!mongoose.models.products) {
//   ProductSchema.plugin(mongooseSequence(mongoose), { inc_field: "product_id" });
// }
const Product =
  mongoose.models.products || mongoose.model("products", ProductSchema);

export default Product;
