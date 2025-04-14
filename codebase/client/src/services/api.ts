import { EnergyAccount, PaymentRequest, PaymentResponse } from "../types";

const API_URL = "http://localhost:3001/api";

export const fetchAccounts = async (): Promise<EnergyAccount[]> => {
  try {
    const response = await fetch(`${API_URL}/accounts`);
    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const makePayment = async (
  paymentData: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    const response = await fetch(`${API_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Payment failed");
    }

    return data;
  } catch (error) {
    console.error("Error making payment:", error);
    throw error;
  }
};
