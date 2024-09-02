import express from "express";
import {
  addAddress,
  deleteAddress,
  deleteCustomer,
  getAllAddressForCustomerUsingUserId,
  getAllCustomers,
  getCustomerById,
  registerCustomer,
  seachCustomerByNameOrPhone,
  updateAddress,
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
customerRouter.route("/getAllAddressesByCustomerId/:id").get(getAllAddressForCustomerUsingUserId)
customerRouter.route("/update/:customer_id/address/:address_id").post(updateAddress)
customerRouter.route("/deleteAddress/:customer_id/address/:address_id").delete(deleteAddress)

export default customerRouter;
