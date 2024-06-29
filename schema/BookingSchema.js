import mongoose from "mongoose";
import payments from "razorpay/dist/types/payments";

const reqstring = {
  type: String,
  required: true,
};

const bookingSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops",
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: reqstring,

  payments: {
    type: String,
    enum: ["ONLINE", "OFFLINE"],
    required: true,
  },
  status :{
    type: String,
    enum: ["INITIATED", "PAID", "COMPLETED", "CANCELLED"],
    default: "INITIATED",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
