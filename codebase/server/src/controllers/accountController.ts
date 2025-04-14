import { Request, Response } from "express";
import { getAccounts, processPayment } from "../services/accountService";
import { PaymentRequest } from "../models/types";

export const getAccountsController = async (_req: Request, res: Response) => {
  try {
    const accounts = await getAccounts();
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

export const processPaymentController = async (req: Request, res: Response) => {
  try {
    const paymentRequest = req.body as PaymentRequest;
    const result = await processPayment(paymentRequest);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
};
