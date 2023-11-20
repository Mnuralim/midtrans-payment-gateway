"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentCallback = exports.createPayment = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const midtrans_client_1 = __importDefault(require("midtrans-client"));
const payment_1 = __importDefault(require("../models/payment"));
const crypto_1 = __importDefault(require("crypto"));
const createPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, total, name } = req.body;
    try {
        const createPayment = yield payment_1.default.create({
            orderId,
            total,
            name,
        });
        const snap = new midtrans_client_1.default.Snap({
            isProduction: false,
            serverKey: "SB-Mid-server-6MZ5JE49DtJ4yKZ1hC7Wc1Iw",
            clientKey: "SB-Mid-client-B2p2MND0rWDvF45n",
        });
        const transaction = yield snap.createTransaction({
            transaction_details: {
                order_id: createPayment.orderId,
                gross_amount: createPayment.total,
            },
            customer_details: {
                first_name: createPayment.name,
            },
        });
        const dataPayment = {
            response: JSON.stringify(transaction),
        };
        console.log(dataPayment);
        res.status(200).json({
            message: "success",
            dataPayment,
            token: transaction.token,
        });
    }
    catch (error) {
        next(new apiError_1.default("Failed to create payment", 500));
    }
});
exports.createPayment = createPayment;
const paymentCallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = req.body;
    try {
        const serverKey = "SB-Mid-server-6MZ5JE49DtJ4yKZ1hC7Wc1Iw";
        const hashed = crypto_1.default
            .createHash("sha512")
            .update(order_id + status_code + gross_amount + serverKey)
            .digest("hex");
        if (hashed === signature_key) {
            if (transaction_status == "settlement") {
                const payment = yield payment_1.default.findOne({ orderId: order_id });
                if (!payment)
                    return next(new apiError_1.default("Transaksi tidak ada", 404));
                payment.status = "paid";
                yield payment.save();
            }
        }
        res.status(200).json({
            message: "success",
        });
    }
    catch (error) {
        next(new apiError_1.default("Failed to create payment", 500));
    }
});
exports.paymentCallback = paymentCallback;
const getAllDataPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
