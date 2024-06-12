import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generate as generateOTP } from "generate-password";

const reqString = {
  type: String,
  required: true,
};

const userSchema = mongoose.Schema({
  username: reqString,
  password: reqString,
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  userStatus: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
},
role: {
  type: String,
  enum: ["ADMIN", "CUSTOMER"],
  default: "CUSTOMER",
},
resetPasswordToken: String,
resetPasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
if (!this.isModified("password")) {
  next();
}

const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = generateOTP();
  this.resetPasswordExpires = Date.now() + 300000; // 5 min's
};

const User = mongoose.model("users", userSchema);

export default User;