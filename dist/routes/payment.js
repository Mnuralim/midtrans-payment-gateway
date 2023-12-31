"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_1 = require("../controllers/payment");
const router = express_1.default.Router();
router.post("/", payment_1.createPayment);
router.post("/payment-callback", payment_1.paymentCallback);
router.get("/:order_id", payment_1.getPaymentDetail);
const PaymentRouter = router;
exports.default = PaymentRouter;
