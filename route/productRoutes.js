import express from "express";
import { addProduct, updateProduct } from "../controller/ProductController.js";

const productRouter = express.Router()

productRouter.route("/addProduct").post(addProduct)
productRouter.route("/editProduct/:id").post(updateProduct)

export default productRouter