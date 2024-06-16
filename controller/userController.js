import asyncHandler from "express-async-handler";
import User from "../schema/UserSchema.js";

export const login = asyncHandler(async (req, res) => {
  try {
    const { phone, password } = req.body;
    const userDoc = await User.findOne({ phone });
    if (!userDoc) {
      return res.status(404).jsonn({
        success: false,
        msg: `User does not exist with phone number, ${phone}`,
      });
    }

    if (!(await userDoc.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, msg: "Passowrd does not match" });
    }

    return res
      .status(200)
      .json({ success: true, msg: "Logged in successfully" });
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

export const getUserById = asyncHandler(async(req, res)=>{
  try {
    const id = req.params.id

    const userDoc = await User.findById(id);
    if(!userDoc){
      console.log("User not found");
      return res.status(400).json({success: false, msg: "User not found"});
    }
    return res.status(200).json({success: true, userDoc});
  } catch (error) {
    console.log(error, {success:false, msg:`Could not find user `});
    return res.status(500).json({success: false, error})
  }
});


