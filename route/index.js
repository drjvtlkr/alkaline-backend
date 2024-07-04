import expressRouter from "express"
import userRouter from "./userRoutes.js";
import customerRouter from "./customerRoutes.js";
import bookingRouter from "./bookingRoutes.js";
import productRouter from "./productRoutes.js";

const router = expressRouter();

router.use("/user", userRouter)
router.use("/customer", customerRouter)
router.use("/booking", bookingRouter)
router.use("/product", productRouter)

export default router;