import asyncHandler from "express-async-handler";
import Product from "../schema/ProductsSchema.js";

export const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, capacity, productDesc, img } = req.body;
    const productDoc = await Product.create({
      name,
      productDesc,
      capacity,
      img,
      price,
    });
    res.status(201).json({
      msg: "Product Saved Successfully",
      success: true,
      productDoc,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error ", success: false });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, capacity, productDesc, img, productId } = req.body;
    let productDoc;
    productDoc = await Product.findById(productId);
    if (!productDoc) {
      return res.status(404).json({ success: false, msg: "Product Not found" });
    }

    productDoc = await Product.updateOne({
      productId,
      name,
      price,
      capacity,
      productDesc,
      img,
    });

    return res.status(200).json({
        success:true,
        msg: `Product with ID ${id} updated successfully`,
        productDoc
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `Internal Server Error` });
  }
});

export const getAllProducts = asyncHandler(async(req, res)=>{
  try {
    const products = await Product.find({});
    return res.status(200).json({success:true, products});  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `Internal Server Error` });
  }
})

export const getProductById = asyncHandler(async(req, res)=>{
  try {
    const id = req.params.id;
    const productDoc = await Product.findById(id)
    if(!productDoc){
      return res.status(404).json({success:false, msg:`Product with ID ${id} not found`})
    }else{
      return res.status(200).json({success:true, productDoc})
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg:`Internal Server Error`})
  }
})

export const deleteProduct = asyncHandler(async(req, res)=>{
  try {
    const id = req.params.id;
    const productDoc = await Product.findByIdAndDelete(id)
    if(!productDoc){
      return res.status(404).json({success:false, msg:`Product with ID ${id} not found`})
    }else{
      return res.status(200).json({success:true, msg:`Product with ID ${id} deleted successfully`})
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg:`Internal Server Error`})
  }
})