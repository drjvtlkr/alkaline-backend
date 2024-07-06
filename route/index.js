import expressRouter from "express"
import userRouter from "./userRoutes.js";
import customerRouter from "./customerRoutes.js";
import bookingRouter from "./bookingRoutes.js";

const router = expressRouter();

router.use("/user", userRouter)
router.use("/customer", customerRouter)
router.use("/booking", bookingRouter)

export default router;