import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  registerCustomer,
  updateCustomer,
} from "../controller/customerContoller.js";

const customerRouter = express.Router();
customerRouter.route("/createCustomer").post(registerCustomer);
customerRouter.route("/updateCustomer").post(updateCustomer);
customerRouter.route("/getAllCustomers").get(getAllCustomers);
customerRouter.route("/getCustomerById/:id").get(getCustomerById);

export default customerRouter;
