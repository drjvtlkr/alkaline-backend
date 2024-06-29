import mongoose from "mongoose";

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
  gender: { 
    type: String, 
    enum: ["MALE", "FEMALE"] 
  }
});

const Customer = mongoose.model("customers", customerSchema);
export default Customer;
