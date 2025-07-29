import mongoose from "mongoose";
// const product = new mongoose.Schema({ name: String });
const mongooseSequence = require("mongoose-sequence");

const OrderedItemSchema = new mongoose.Schema(
  {
    order_id: { type: String },
    user_id: { type: mongoose.Schema.ObjectId },
    product_id: { type: mongoose.Schema.ObjectId },
    quantity: { type: Number },
    unit_cost: { type: Number },
    tax_cost: { type: Number },
    subtotal: { type: Number },
  },
  { timestamps: true }
);

if (!mongoose.models.ordered_items) {
  OrderedItemSchema.plugin(mongooseSequence(mongoose), {
    inc_field: "ordered_item_id",
  });
}
const OrderedItem =
  mongoose.models.ordered_items ||
  mongoose.model("ordered_items", OrderedItemSchema);

export default OrderedItem;
