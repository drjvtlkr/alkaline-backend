import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const orderSchema = mongoose.Schema({
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  payment: String,
  deliveryAddress: {
    type: String,
    required: false,
  },

  mode: String,
  orderStatus: {
    type: String,
    enum: ["PLACED", "COMPLETED"],
    default: "PLACED",
  },
  rejectReason: String,
});
orderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});
const Order = mongoose.model("orders", orderSchema);
export default Order;
