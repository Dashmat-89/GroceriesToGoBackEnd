import mongoose, { Schema, model } from "mongoose";

const CartItemsSchema = new Schema({
  product_id: { type: mongoose.Schema.ObjectId },
  user_id: { type: mongoose.Schema.ObjectId },
  unit_cost: { type: Number },
  tax_cost: { type: Number },
  quantity: { type: Number },
  subtotal: { type: Number },
});

const CartItems =
  mongoose.models.CartItems ||
  model("CartItems", CartItemsSchema, "cart_items");
export default CartItems;
