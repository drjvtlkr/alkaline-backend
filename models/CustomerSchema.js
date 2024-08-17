import mongoose, { mongo } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const customerSchema = new mongoose.Schema({
  firstName: reqString,
  lastName: reqString,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
  shopName: reqString,
  shopNumber: reqString,
  // shopAddress: { type: mongoose.Schema.Types.ObjectId, ref: "addresses" },
  // pincode: {
  //   type: Number,
  //   required: true,
  // },
  // landmark: {
  //   type: String,
  //   required: false,
  // },
});

const Customer = mongoose.model("customers", customerSchema);
export default Customer;
