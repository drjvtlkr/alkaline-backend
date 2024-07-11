import mongoose from "mongoose";

const reqstring = {
  type: String,
  required: true,
};

const paymentSchema = mongoose.Schema({
  paymentId: reqstring,
  mode: {
    type: String,
    enum: ["ONLINE", "OFFLINE"],
    required: true,
  },
});

const bookingSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
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
  totalPrice: { type: Number, required: true  },

  payments: paymentSchema,

  status: {
    type: String,
    enum: ["INITIATED", "PAID", "COMPLETED", "CANCELLED"],
    default: "INITIATED",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
