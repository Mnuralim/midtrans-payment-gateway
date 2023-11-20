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
exports.createPayment = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const midtrans_client_1 = __importDefault(require("midtrans-client"));
const createPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, total, name } = req.body;
    try {
        const snap = new midtrans_client_1.default.Snap({
            isProduction: false,
            serverKey: "SB-Mid-server-6MZ5JE49DtJ4yKZ1hC7Wc1Iw",
            clientKey: "SB-Mid-client-B2p2MND0rWDvF45n",
        });
        const transaction = yield snap.createTransaction({
            transaction_details: {
                order_id: orderId,
                gross_amount: total,
            },
            customer_details: {
                first_name: name,
            },
        });
        const dataPayment = {
            response: JSON.stringify(transaction),
        };
        res.status(200).json({
            message: "success",
            dataPayment,
            token: transaction.token,
        });
    }
    catch (error) {
        // Pass the error to the next middleware
        next(new apiError_1.default("Failed to create payment", 500));
    }
});
exports.createPayment = createPayment;
