import express from "express";
import {
  afterPaymentofBooking,
  getAllBookingsPagination,
  getAllBookingsBetweenDates,
  getBookingById,
  getBookingByStatus,
  getBookingByCustomerId,
  initiateBooking,
  markBookingComplete,
  markPaymentCompletedOfBooking,
  getBookingsForDate
} from "../controller/bookingController.js";


const bookingRouter = express.Router();

bookingRouter.route("/initiated").post(initiateBooking);
bookingRouter.route("/:id/afterPayment").post(afterPaymentofBooking);
bookingRouter.route("/getAllBookings").get(getAllBookingsPagination);
bookingRouter.route("/getBookingById/:id").get(getBookingById);
bookingRouter.route("/complete/:id").post(markBookingComplete);
bookingRouter.route("/updatePaymentIdForCompletedBooking/:id").post(markPaymentCompletedOfBooking)
bookingRouter.route("/getBookingByStatus/:status").get(getBookingByStatus)
bookingRouter.route("/getBookingByCustomer/:id").get(getBookingByCustomerId)//this has pagination
bookingRouter.route("/getAllBookingsBetweenDatesPagination").get(getAllBookingsBetweenDates);
bookingRouter.route("/getBookingForDate").get(getBookingsForDate)

export default bookingRouter;
