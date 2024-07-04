import mongoose from "mongoose";

const reqstring = {
  type: String,
  required: true,
};

const paymentSchema = mongoose.Schema({
  paymentId: reqstring,
  mode: { type: String },
  enum: ["ONLINE", "OFFLINE"],
});

const bookingSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  units:[{type: mongoose.Schema.Types.ObjectId, ref: "units"}],
  // shop: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "shops",
  //   required: true,
  // },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: reqstring,
  totalPrice: { type: Number },

  payments: paymentSchema,

  status: {
    type: String,
    enum: ["INITIATED", "PAID", "COMPLETED", "CANCELED"],
    default: "INITIATED",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
