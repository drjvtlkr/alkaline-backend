import expressRouter from "express"
import userRouter from "./userRoutes.js";
import customerRouter from "./customerRoutes.js";

const router = expressRouter();

router.use("/user", userRouter)
router.use("/customer", customerRouter)

export default router;