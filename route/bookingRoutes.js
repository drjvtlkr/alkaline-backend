import express from "express";
import {
  afterPaymentofBooking,
  getAllBookings,
  getAllBookingsBetweenDates,
  getBookingById,
  getBookingByStatus,
  getBookingByCustomerId,
  initiateBooking,
  markBookingComplete
} from "../controller/bookingController.js";


const bookingRouter = express.Router();

bookingRouter.route("/initiated").post(initiateBooking);
bookingRouter.route("/:id/afterPayment").post(afterPaymentofBooking);
bookingRouter.route("/getAllBookings").get(getAllBookings);
bookingRouter.route("/getBookingById/:id").get(getBookingById);
bookingRouter.route("/complete/:id").post(markBookingComplete);
bookingRouter.route("/getBookingByStatus/:status").get(getBookingByStatus)
bookingRouter.route("/getBookingByCustomer/:id").get(getBookingByCustomerId)//this has pagination
bookingRouter.route("/getAllBookingsBetweenDatesPagination").get(getAllBookingsBetweenDates);

export default bookingRouter;
