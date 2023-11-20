import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  orderId: string;
  total: number;
  name: string;
  status: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: String,
    },
    name: {
      type: String,
    },
    total: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
