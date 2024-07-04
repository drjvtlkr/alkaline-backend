import asyncHandler from "express-async-handler";
import Customer from "../schema/CustomerSchema.js";
import Booking from "../schema/BookingSchema.js";

export const initiateBooking = asyncHandler(async (req, res) => {
  try {
    const { customerId, bookingDate, bookingTime, unit } = req.body;

    const customerDoc = await Customer.findById(customerId);
    console.log(customerId);
    if (!customerDoc) {
      return res.status(404).json({
        success: false,
        msg: "customer not found",
      });
    }
    const bookingDoc = await Booking.create({
      customer: customerId,
      bookingDate,
      bookingTime,
    });

    res.status(201).json({
      msg: "Booking is initiated",
      success: true,
      bookingDoc,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: 'Internal Server Error', success: false });
  }
});

export const afterPaymentofBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { payment, mode } = req.body;

  if (!id || !payment || !mode) {
    return res.status(400).json({
      message:
        "Booking Id and Payment Details/Id and mode of payment are required",
      success: false,
    });
  }

  try {
    const booking = await Booking.findById(id);
    if (!booking || booking.status != "INITIATED") {
      return res.status(404).json({
        message: booking
          ? `Status is invalid ${booking.status}`
          : `Booking id not found ${id}`,
        success: false,
        booking,
      });
    }
    booking.status = "PAID";
    await booking.save();
    return res.status(200).json({ booking, success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server Error", success: false });
  }
});

export const getBookingById = asyncHandler(async (req, res) => {
  try {
    const bookingId = req.params.id;
    const bookingDoc = await Booking.findById(bookingId)
      .populate("customer")
      .exec();
    if (!bookingDoc) {
      return res
        .status(404)
        .json({ msg: `Booking Id Not Found ${bookingId}`, success: false });
    }
    return res.status(200).json({ bookingDoc, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, success: false });
  }
});

export const getAllBookings = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortField = req.query.sortField || "bookingDate";
    const sortOrder = req.query.sortOrder || "asc";

    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    const startIndex = (page - 1) * pageSize;

    const totalDocuments = await Booking.countDocuments({
      status: { $in: ["PAID", "ASSIGNED", "COMPLETED", "REJECTED"] },
    });
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const bookings = await Booking.find({
      status: { $in: ["PAID", "ASSIGNED", "COMPLETED", "REJECTED"] },
    })
      .sort(sort)
      .skip(startIndex)
      .limit(pageSize)
      .populate("customer")
      .exec();

    return res.status(200).json({
      bookings,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalDocuments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, success: false });
  }
});

export const markBookingComplete = asyncHandler(async (req, res) => {
  try {
    const bookingId = req.params.id;
    const bookingDoc = await Booking.findById(bookingId);

    if (!bookingDoc) {
      return res.status(404).json({
        message:` Booking ID not found ${bookingId}`,
        success: false,
        bookingId,
      });
    }

    if (bookingDoc.status === "COMPLETED") {
      return res.status(400).json({
        message: "Booking is already completed",
        success: false,
        bookingId,
      });
    }

    if (bookingDoc.status !== "PAID") {
      return res.status(400).json({
        message: `Status is invalid ${bookingDoc.status}`,
        success: false,
        bookingId,
      });
    }

    bookingDoc.status = "COMPLETED";
    await bookingDoc.save();

    return res.status(200).json({
      message: "Booking marked as completed successfully",
      success: true,
      bookingId,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
});