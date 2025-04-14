export type EnergyAccount = {
  id: string;
  type: "ELECTRICITY" | "GAS";
  balance: number;
  address: string;
};

export type PaymentRequest = {
  accountId: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  amount: number;
};

export type PaymentResponse = {
  success: boolean;
  transactionId?: string;
  message?: string;
};
