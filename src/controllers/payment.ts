import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import midtransClient, { TransactionResult } from "midtrans-client";

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId, total, name } = req.body;

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-6MZ5JE49DtJ4yKZ1hC7Wc1Iw",
      clientKey: "SB-Mid-client-B2p2MND0rWDvF45n",
    });

    const transaction: TransactionResult = await snap.createTransaction({
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
  } catch (error) {
    // Pass the error to the next middleware
    next(new ApiError("Failed to create payment", 500));
  }
};
