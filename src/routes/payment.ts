import express from "express";
import { createPayment } from "../controllers/payment";

const router = express.Router();

router.post("/", createPayment);

const PaymentRouter = router;

export default PaymentRouter;
