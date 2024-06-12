import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const customerSchema = mongoose.Schema({
  customerName: {
    type: reqString,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Customer = mongoose.model("customers", customerSchema);
export default Customer;
