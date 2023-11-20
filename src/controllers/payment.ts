import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import midtransClient, { TransactionResult } from "midtrans-client";
import Payment from "../models/payment";
import crypto from "crypto";

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId, total, name } = req.body;

  try {
    const createPayment = await Payment.create({
      orderId,
      total,
      name,
    });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-6MZ5JE49DtJ4yKZ1hC7Wc1Iw",
      clientKey: "SB-Mid-client-B2p2MND0rWDvF45n",
    });

    const transaction: TransactionResult = await snap.createTransaction({
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

    res.status(200).json({
      message: "success",
      dataPayment,
      token: transaction.token,
    });
  } catch (error) {
    next(new ApiError("Failed to create payment", 500));
  }
};

export const paymentCallback = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id, status_code, gross_amount, signature_key, transaction_status } = req.body;
  try {
    const serverKey = "SB-Mid-server-6MZ5JE49DtJ4yKZ1hC7Wc1Iw";
    const hashed = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hashed === signature_key) {
      if (transaction_status == "settlement") {
        const payment = await Payment.findOne({ orderId: order_id });
        if (!payment) return next(new ApiError("Transaksi tidak ada", 404));
        payment.status = "paid";
        await payment.save();
      }
    }
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    next(new ApiError("Failed to create payment", 500));
  }
};

export const getPaymentDetail = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = req.params;

  try {
    const payment = await Payment.findOne({ orderId: order_id });
    res.status(200).json({
      payment,
    });
  } catch (error) {
    next(new ApiError("Failed to create payment", 500));
  }
};
