import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
  deliveryAddress: {
    type: String,
  },
  pincode: {
    type: Number,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
});

const customerAddressesSchema = mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
  addresses: { type: [addressSchema], required: true },
});

const Address = mongoose.model("addresses", customerAddressesSchema);
export default Address;
