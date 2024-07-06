import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const shopSchema = new mongoose.Schema({
  shopName: {
    type: reqString,
  },
  shopNumber: {
    type: reqString,
  },
  shopAddress: {
    type: reqString,
  },
  pincode: {
    type: reqNumber,
  },
  landmark: {
    type: String,
    required: false,
  },
  customers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
});
const Shop = mongoose.model("shops", shopSchema);
export default Shop;
