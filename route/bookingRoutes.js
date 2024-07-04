import express from "express"
import { afterPaymentofBooking, getAllBookings, getBookingById, initiateBooking, markBookingComplete } from "../controller/bookingController.js";


const bookingRouter = express.Router();

bookingRouter.route("/initiated").post(initiateBooking);
bookingRouter.route("/:id/afterPayment").post(afterPaymentofBooking)
bookingRouter.route("/getAllBookings").get(getAllBookings)
bookingRouter.route("/getBookingById/:id").get(getBookingById)
bookingRouter.route("/complete/:id").post(markBookingComplete)

export default bookingRouter