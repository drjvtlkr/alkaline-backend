import express from "express"
import { getUserById, login, registerAdmin } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerAdmin)
userRouter.route("/login").get(login)
userRouter.route("/getUserBYId/:id").get(getUserById)
export default userRouter;