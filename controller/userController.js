import asyncHandler from "express-async-handler";
import User from "../schema/UserSchema.js";

// export const login = asyncHandler(async(req,res)=>{
//     try {
//         const {phone, password} = req.body;
//         const userDoc = await User.findOne({phone})
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({msg: "Internal Server Error", error, success: false})
//     }
// })

export const register = asyncHandler(async (req, res) => {
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