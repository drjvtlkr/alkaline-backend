import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const productSchema = mongoose.Schema({
  name: reqString,
  price: reqNumber,
  capacity: reqString,
  productDesc: reqString,
  orderCount: { type: Number, default: 0 },
  img: {
    type: String,
    required: false
  }
});

const Product = mongoose.model("products", productSchema);

export default Product;
