import express from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controller/ProductController.js";

const productRouter = express.Router()

productRouter.route("/addProduct").post(addProduct)
productRouter.route("/editProduct/:id").post(updateProduct)
productRouter.route("/getAllProducts").get(getAllProducts)
productRouter.route("/getProductById/:id").get(getProductById)
productRouter.route("/deleteProduct/:id").get(deleteProduct )

export default productRouter