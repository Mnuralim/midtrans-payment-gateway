import express from "express";
import { createPayment, getPaymentDetail, paymentCallback } from "../controllers/payment";

const router = express.Router();

router.post("/", createPayment);
router.post("/payment-callback", paymentCallback);
router.get("/:order_id", getPaymentDetail);

const PaymentRouter = router;

export default PaymentRouter;
