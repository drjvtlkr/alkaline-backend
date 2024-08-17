import asyncHandler from "express-async-handler";
import User from "../models/UserSchema.js";
import Customer from "../models/CustomerSchema.js";
import Booking from "../models/BookingSchema.js";
import Address from "../models/AddressSchema.js";

export const registerCustomer = asyncHandler(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      password,
      shopName,
      shopNumber,
      // shopAddress,
      // pincode,
      // landmark,
    } = req.body;
    let userDoc = await User.findOne({ phone });
    if (userDoc) {
      console.log("Customer already exist " + phone);
      console.log(userDoc._id);
      return res.status(409).json({
        success: false,
        msg: "Customer already exist" + phone,
        userDoc,
      });
    }

    userDoc = await User.create({
      phone,
      username: `${firstName} ${lastName}`,
      password,
      role: "CUSTOMER",
    });

    // const addressDoc = await Address.create({
    //   customerUser_id: userDoc._id,
    //   addresses: [{ shopAddress, pincode, landmark }],
    // });
    // console.log(addressDoc);

    const customerDoc = await Customer.create({
      user: userDoc._id,
      firstName,
      lastName,
      // shopAddress: [addressDoc._id],
      shopName,
      shopNumber,
      // pincode,
      // landmark,
    });

    return res.status(201).json({ success: true, customerDoc, status: "ok" });
  } catch (error) {
    console.error(error, { success: false, msg: `Can not register the user` });
  }
});

export const updateCustomer = asyncHandler(async (req, res) => {
  try {
    const {
      customerId,
      firstName,
      lastName,
      shopName,
      shopNumber,
      shopAddress,
      phone,
      pincode,
      landmark,
    } = req.body;
    const customerDoc = await Customer.findById(customerId);
    if (!customerDoc) {
      return res
        .status(404)
        .json({ success: false, msg: "Customer not found" });
    }

    await Customer.updateOne(
      { _id: customerId },
      {
        firstName,
        lastName,
        shopName,
        shopNumber,
        shopAddress,
        phone,
        pincode,
        landmark,
      },
      { new: true }
    );
    await User.updateOne(
      { _id: customerDoc.user },
      {
        username: `${firstName}${lastName}`,
        phone,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: `Customer with id ${customerId} updated successfully`,
      customerDoc,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, msg: "Could not update the customer" });
  }
});

export const getAllCustomers = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortField = req.query.sortField || "firstName";
    const sortOrder = req.query.sortOrder || "asc";
    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
    const startIndex = (page - 1) * pageSize;
    const totalDocuments = await Customer.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const customerDoc = await Customer.find({})
      .populate({
        path: "user",
        model: "users",
      })
      .sort(sort)
      .skip(startIndex)
      .limit(pageSize)
      .exec();

    return res.status(200).json({
      success: true,
      customerDoc,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalDocuments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error });
  }
});

export const getCustomerById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const customerDoc = await Customer.findById(id).populate({
      path: "user",
      model: "users",
    });
    if (!customerDoc) {
      return res.status(404).json({
        success: false,
        msg: `customer not found`,
      });
    }
    return res.status(200).json({ success: true, customerDoc });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error });
  }
});

export const seachCustomerByNameOrPhone = asyncHandler(async (req, res) => {
  try {
    const query = req.query.query;
    const regexPattern = new RegExp(query, "i");

    const customers = await Customer.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          $or: [
            { "user.phone": { $regex: regexPattern } },
            { "user.username": { $regex: regexPattern } },
            { firstName: { $regex: regexPattern } },
            { lastName: { $regex: regexPattern } },
          ],
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          gender: 1,
          shopName: 1,
          shopNumber: 1,
          shopAddress: 1,
          pincode: 1,
          landmark: 1,
          dateCreated: 1,
          dateModified: 1,
          user: {
            _id: 1,
            username: 1,
            phone: 1,
            userStatus: 1,
            role: 1,
            dateCreated: 1,
            dateModified: 1,
          },
        },
      },
    ]);
    if (customers.length === 0) {
      return res.status(404).json({
        msg: `No data available for the searchQuery ${query}`,
        success: false,
      });
    }

    return res.status(200).json({ success: true, customers });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const customerDoc = await Customer.findByIdAndDelete(id);
    if (!customerDoc || customerDoc.length === 0) {
      return res.status(404).json({
        msg: `customer with ${id} not found, either deleted already or they do not exist`,
        success: false,
      });
    }
    const userId = customerDoc.user;
    await Customer.findByIdAndDelete(id);
    await User.findByIdAndDelete(userId);
    await Booking.deleteMany({ customer: id });
    return res.status(200).json({
      success: true,
      msg: `Customer with id ${id}, userId ${userId} and all their bookings deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

export const addAddress = asyncHandler(async (req, res) => {
  try {
    const customerId = req.params.id;
    const { customer_id, deliveryAddress, pincode, landmark } = req.body;
    let addressDoc = await Address.findOne({customer_id:customerId});
    if(!addressDoc){
      addressDoc = await Address.create({
       customer_id: customerId,
       deliveryAddress,
       pincode,
       landmark
     })
    }
    console.log(customerId);

    // Find the address document associated with the customer
    // addressDoc = await Address.findOne({ customer_id: customerId });
    console.log(addressDoc);
    
    if (addressDoc) {
      addressDoc.addresses.push({ customer_id, deliveryAddress, pincode, landmark });
    //   return res
    //     .status(404)
    //     .json({ success: false, msg: "Customer not found" });
    }


    await addressDoc.save();

    return res
      .status(200)
      .json({ success: true, addressDoc, msg: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
});

export const getAllAddressForCustomerUsingUserId = asyncHandler(
  async (req, res) => {
    try {
      const userId = req.params.id;
      const addressDoc = await Address.find({ customerUser_id: userId });
      console.log(addressDoc);
      return res.status(200).json({
        msg: `fetched all the address for the customer with user id ${userId}`,
        success: true,
        addressDoc
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Internal Server Error" });
    }
  }
);

export const updateAddress = asyncHandler(async(req,res)=>{
  try {
    const addressId= req.params.id;

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: "Internal Server Error"
    })
  }
})
