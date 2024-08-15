import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
  addresses: {
    type: Array,
    required: true,
  },
});

const Address = mongoose.model("addresses", addressSchema);
export default Address;
