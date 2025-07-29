import mongoose from "mongoose";
const mongooseSequence = require("mongoose-sequence");

const ReceiptSchema = new mongoose.Schema(
  {
    order_id: { type: String },
    internal_user_id: { type: String },
    payment_method: { type: String },
    phone_number: { type: Number },
    received_by: { type: String },
    tax_cost: { type: Number },
    subtotal: { type: Number },
    total: { type: Number },
    created_at: { type: Date },
  },
  { timestamps: true }
);

if (!mongoose.models.receipt) {
  ReceiptSchema.plugin(mongooseSequence(mongoose), {
    inc_field: "receipt_id",
  });
}
const Receipt =
  mongoose.models.receipt || mongoose.model("receipt", ReceiptSchema);

export default Receipt;
