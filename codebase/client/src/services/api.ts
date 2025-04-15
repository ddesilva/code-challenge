import axios from "axios";
import { EnergyAccount, PaymentRequest, PaymentResponse } from "../types";

const API_URL = "http://localhost:3001/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchAccounts = async (): Promise<EnergyAccount[]> => {
  try {
    const response = await api.get("/accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const makePayment = async (
  paymentData: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    const response = await api.post("/payment", paymentData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Extract the error message from the response if available
      throw new Error(error.response.data.message || "Payment failed");
    }
    console.error("Error making payment:", error);
    throw error;
  }
};
