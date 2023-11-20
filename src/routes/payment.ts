import express from "express";
import { createPayment, paymentCallback } from "../controllers/payment";

const router = express.Router();

router.post("/", createPayment);
router.post("/payment-callback", paymentCallback);

const PaymentRouter = router;

export default PaymentRouter;
