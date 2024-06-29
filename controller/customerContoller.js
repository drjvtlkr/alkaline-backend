import asyncHandler from "express-async-handler";
import User from "../schema/UserSchema.js";
import Customer from "../schema/CustomerSchema.js";

export const registerCustomer = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, gender, phone, password } = req.body;
    let userDoc = await User.findOne({ phone });
    let customerDoc = await Customer.findOne({ phone });
    if (userDoc) {
      console.log("Customer already exist " + phone);
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

    customerDoc = await Customer.create({
      user: userDoc._id,
      firstName,
      lastName,
      gender,
    });

    return res.status(201).json({ success: true, customerDoc });
  } catch (error) {
    console.error(error, { success: false, msg: `Can not register the user` });
  }
});

export const updateCustomer = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, gender, phone } = req.body;
    let customerDoc;
    customerDoc = await Customer.findById(id);
    if (!customerDoc) {
      return res
        .status(404)
        .json({ success: false, msg: "Customer not found" });
    }

    customerDoc = await Customer.updateOne({
      firstName,
      lastName,
      gender,
      phone,
    });

    return res
      .status(200)
      .json({
        success: true,
        msg: `Customer with id ${id} updated successfullt`,
        customerDoc,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ suucess: false, msg: "could not update the customer" });
  }
});

export const getAllCustomers = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortField = req.query.sortField || "id";
    const sortOrder = req.query.sortOrder || "asc";
    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
    const startIndex = (page - 1) * pageSize;
    const totalDocuments = await Customer.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const customerDoc = await Customer.find({})
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

export const getCustomerById= asyncHandler(async(req, res)=>{
    try {
        const id = req.params.id;
        const customerDoc = await Customer.findById(id)
        if(!customerDoc){
            return res.status(404).json({
                success: false, msg:`cusotmer not found`
            })
        }
         return res.status(200).json({success:true, customerDoc})
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, error})
    }
})
