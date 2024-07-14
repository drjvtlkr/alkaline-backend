import express from "express";
import {
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  registerCustomer,
  seachCustomerByNameOrPhone,
  updateCustomer,
} from "../controller/customerContoller.js";

const customerRouter = express.Router();
customerRouter.route("/createCustomer").post(registerCustomer);
customerRouter.route("/updateCustomer").post(updateCustomer);
customerRouter.route("/getAllCustomers").get(getAllCustomers);
customerRouter.route("/getCustomerById/:id").get(getCustomerById);
customerRouter.route("/searchQuery").get(seachCustomerByNameOrPhone);
customerRouter.route("/deleteCustomer/:id").delete(deleteCustomer);

export default customerRouter;
