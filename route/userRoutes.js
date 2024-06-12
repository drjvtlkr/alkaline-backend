import express from "express"
import { register } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.route("/register").post(register)

export default userRouter;