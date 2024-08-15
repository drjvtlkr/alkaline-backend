import asyncHandler from "express-async-handler";
import User from "../models/UserSchema.js";
import Customer from "../models/CustomerSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login = asyncHandler(async (req, res) => {
  try {
    const { phone, password } = req.body;
    const userDoc = await User.findOne({ phone });
    if (!userDoc) {
      return res.status(404).json({
        success: false,
        msg: `User does not exist with phone number, ${phone}`,
      });
    }

    if (!(await userDoc.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid Credentials" });
    }

    const token = jwt.sign({ phone: userDoc.phone }, process.env.JWT_SECRET);

    return res
      .status(200)
      .json({ success: true, data: token, msg: "Logged in successfully", status: "ok", userDoc});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error, success: false });
  }
});

export const registerAdmin = asyncHandler(async (req, res) => {
  try {
    const { username, password, phone, role } = req.body;

    const userDoc = await User.findOne({ phone });
    console.log(userDoc);
    if (userDoc) {
      return res
        .status(409)
        .json({ userDoc, success: false, msg: "User Already Exist" });
    }
    const user = await User.create({
      username,
      password,
      phone,
      role,
    });
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, success: false });
  }
});

export const getUserData = asyncHandler(async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userPhone = user.phone;
    const userData = await User.findOne({ phone: userPhone });

    if (userData.role === "CUSTOMER") {
      const customerData = await Customer.findOne({ user: userData._id });
      return res.send({ status: "ok", data: userData, customerData: customerData });
    }

    return res.send({ status: "ok", data: userData });
  } catch (error) {
    console.log(error, { success: false, msg: `Could not find user` });
    return res.status(500).json({ success: false, error });
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    const userDoc = await User.findById(id);
    if (!userDoc) {
      console.log("User not found");
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    return res.status(200).json({ success: true, userDoc });
  } catch (error) {
    console.log(error, { success: false, msg: `Could not find user ` });
    return res.status(500).json({ success: false, error });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortField = req.query.sortField || "username";
    const sortOrder = req.query.sortOrder || "asc";
    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
    const startIndex = (page - 1) * pageSize;
    const totalDocuments = await User.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / pageSize);
    const userDoc = await User.find({})
      .sort(sort)
      .skip(startIndex)
      .limit(pageSize)
      .exec();
    if (!userDoc) {
      console.log("User not found");
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    return res.status(200).json({
      success: true,
      userDoc,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalDocuments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(error, { success: false, msg: `Could not find user ` });
    return res.status(500).json({ success: false, error });
  }
});

export const getAllAdmins = asyncHandler(async (req, res) => {
  try {
    const admins = await User.find({ role: "ADMIN" });
    if (!admins || admins.length === 0) {
      return res.status(404).json({ success: false, msg: "No admins found" });
    }

    return res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

export const deleteUser =  asyncHandler(async(req, res)=>{
  try {
    const id = req.params.id;
    const userDoc= await User.findByIdAndDelete(id);
    if(!userDoc || userDoc.length === 0){
      return res.status(404).json({
        msg : `Could not delete or find the user by id ${id}`,
        success: false
      })
    }

     return res.status(200).json({
      msg: `Deleted user by id ${id} successfully`,
      success:true
     })
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg: "Internal Server Error", success: false})
  }
})
