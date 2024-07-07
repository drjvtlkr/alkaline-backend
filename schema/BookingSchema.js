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

  bookingDateTime: {
    type: Date,
    required: true,
  },
  // bookingTime: reqstring,
  totalPrice: { type: Number },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      count: { type: Number },
    },
  ],
  payments: paymentSchema,

  status: {
    type: String,
    enum: ["INITIATED", "PAID", "COMPLETED", "CANCELED"],
    default: "INITIATED",
  },
  createdAt: { type: Date, default: Date.now },
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