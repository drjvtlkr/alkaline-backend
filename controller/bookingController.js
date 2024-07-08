import asyncHandler from "express-async-handler";
import Customer from "../schema/CustomerSchema.js";
import Booking from "../schema/BookingSchema.js";
import Product from "../schema/ProductsSchema.js";
import e from "express";
import { populate } from "dotenv";

export const initiateBooking = asyncHandler(async (req, res) => {
  try {
    const { customerId, bookingDateTime, products } = req.body;

    const customerDoc = await Customer.findById(customerId);
    console.log(customerId);
    if (!customerDoc) {
      return res.status(404).json({
        success: false,
        msg: "customer not found",
      });
    }

    for (const product of products) {
      const productDoc = await Product.findById(product.product);
      if (!productDoc) {
        return res
          .status(404)
          .json({
            msg: `Prodcut not found with id ${product.product}`,
            success: false,
          });
      }
    }

    const bookingDoc = await Booking.create({
      customer: customerId,
      bookingDateTime,
      products,
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
      .json({ msg: "Internal Server Error", success: false });
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
    const sortField = req.query.sortField || "id";
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
        message: ` Booking ID not found ${bookingId}`,
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

export const getBookingByStatus = asyncHandler(async (req, res) => {
  try {
    const status = req.params.status;

    const bookingDoc = await Booking.find({ status: status });
    if (!bookingDoc) {
      return res
        .status(404)
        .json({
          msg: "Booking with this status not available",
          success: false,
          status,
        });
    }

    return res.status(200).json({ success: true, bookingDoc });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "INternal Server Error", success: false });
  }
});

export const getBookingByCustomerId = asyncHandler(async (req, res) => {
  try {
    const customerId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortField = req.query.sortField || "id";
    const sortOrder = req.query.sortOrder || "desc";

    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
    const startIndex = (page - 1) * pageSize;
    const totalDocuments = await Booking.countDocuments({
      customer: customerId,
    });
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const booking = await Booking.find({ customer: customerId })
      .populate("customer")
      .populate("products")
      .sort(sort)
      .skip(startIndex)
      .limit(pageSize)
      .exec();

    return res.status(200).json({
      booking,
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
    console.error(error);
    res.status(500).json({ error, success: false });
  }
});

export const getAllBookingsBetweenDates = asyncHandler(async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder || "asc";
    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
    const startIndex = (page - 1) * pageSize;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "StartDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format" });
    }
    end.setHours(23, 59, 59, 999);
    const totalDocuments = await Booking.countDocuments({
      bookingDate: { $gte: start, $lte: end },
    });
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const bookingDoc = await Booking.find({
      bookingDate: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("products")
      .populate({
        path: "customer",
        populate: {
          path: "user",
          model: "users",
        },
      })
      .sort(sort)
      .skip(startIndex)
      .limit(pageSize)
      .exec();

    return res.status(200).json({
      bookingDoc,
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
    console.error(error);
    return res.status(500).json({ success: false, error });
  }
});
