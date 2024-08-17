import express from "express";
import {
  addAddress,
  deleteCustomer,
  getAllAddressForCustomerUsingUserId,
  getAllCustomers,
  getCustomerById,
  registerCustomer,
  seachCustomerByNameOrPhone,
  updateCustomer,
} from "../controller/customerContoller.js";

const customerRouter = express.Router();
customerRouter.route("/createCustomer").post(registerCustomer);
customerRouter.route("/updateCustomer/:id").post(updateCustomer);
customerRouter.route("/getAllCustomers").get(getAllCustomers);
customerRouter.route("/getCustomerById/:id").get(getCustomerById);
customerRouter.route("/searchQuery").get(seachCustomerByNameOrPhone);
customerRouter.route("/deleteCustomer/:id").delete(deleteCustomer);
customerRouter.route("/addAddress/:id").post(addAddress);
customerRouter.route("/getAllAddressesByCustomerUserId/:id").get(getAllAddressForCustomerUsingUserId)


export default customerRouter;
