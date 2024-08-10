import mongoose from "mongoose";

import moment from "moment-timezone";

const reqstring = {
  type: String,
  required: true,
};

const paymentSchema = mongoose.Schema({
  paymentId: reqstring,
  mode: { type: String, enum: ["ONLINE", "OFFLINE"], required: true },
});

const bookingSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },

  bookingDateTime: {
    type: Date,
    required: true,
  },

  totalPrice: { type: Number },

  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      name: reqstring,
      price: {type: Number, required: true},
      count: { type: Number },
    },
  ],
  payments: paymentSchema,

  status: {
    type: String,
    enum: ["INITIATED", "PAID", "COMPLETED", "CASH_ON_DELIVERY"],
    default: "INITIATED",
  },
  
  updatedAt: { type: Date, default: Date.now },
});

bookingSchema.pre("save", async function (next) {
  if (this.bookingDateTime) {
    console.log(moment(this.bookingDateTime).tz("Asia/Kolkata").toDate());
    this.bookingDateTime = moment(this.bookingDateTime)
      .tz("Asia/Kolkata")
      .toDate();
  }
  this.dateModified = new Date();
  next();
});

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
