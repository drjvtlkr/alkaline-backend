import mongoose from "mongoose";

import moment from "moment-timezone";
// import momentTimezone from "moment-timezone";

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
  bookingDateTime: {
    type: Date,
    required: true,
  },
  totalPrice: { type: Number, required: true },

  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      count: { type: Number },
    },
  ],

  payments: paymentSchema,

  status: {
    type: String,
    enum: ["INITIATED", "PAID", "COMPLETED", "CANCELLED"],
    default: "INITIATED",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// bookingSchema.pre("save", function (next) {
//   if (this.bookingDateTime) {
//     this.bookingDateTime = moment(this.bookingDateTime)
//       .tz("Asia/Kolkata")
//       .toDate();
//   }
//   this.dateModified = moment(this.bookingDateTime).tz("Asia/Kolkata").toDate();
//   next();
// });

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
