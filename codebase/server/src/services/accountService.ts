import {
  EnergyAccount,
  PaymentRequest,
  PaymentResponse,
} from "../models/types";

// Mock data for energy accounts
const accounts: EnergyAccount[] = [
  {
    id: "A-0001",
    type: "ELECTRICITY",
    balance: 30,
    address: "1 Greville Ct, Thomastown, 3076, Victoria",
  },
  {
    id: "A-0002",
    type: "GAS",
    balance: 0,
    address: "74 Taltarni Rd, Yawong Hills, 3478, Victoria",
  },
  {
    id: "A-0003",
    type: "ELECTRICITY",
    balance: -40,
    address: "44 William Road, Cresswell Downs, 0862, Northern Territory",
  },
  {
    id: "A-0004",
    type: "ELECTRICITY",
    balance: 50,
    address: "87 Carolina Park Road, Forresters Beach, 2260, New South Wales",
  },
  {
    id: "A-0005",
    type: "GAS",
    balance: 25,
    address: "12 Sunset Blvd, Redcliffe, 4020, Queensland",
  },
  {
    id: "A-0006",
    type: "ELECTRICITY",
    balance: -15,
    address: "3 Ocean View Dr, Torquay, 3228, Victoria",
  },
  {
    id: "A-0007",
    type: "GAS",
    balance: 0,
    address: "150 Greenway Cres, Mawson Lakes, 5095, South Australia",
  },
  {
    id: "A-0008",
    type: "ELECTRICITY",
    balance: 120,
    address: "88 Harbour St, Sydney, 2000, New South Wales",
  },
  {
    id: "A-0009",
    type: "GAS",
    balance: -60,
    address: "22 Boulder Rd, Kalgoorlie, 6430, Western Australia",
  },
];

export const getAccounts = async (): Promise<EnergyAccount[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(accounts);
    }, 500);
  });
};

export const processPayment = async (
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> => {
  // Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic validation
      if (
        !paymentRequest.cardNumber ||
        !paymentRequest.cardholderName ||
        !paymentRequest.expiryDate ||
        !paymentRequest.cvv
      ) {
        resolve({
          success: false,
          message: "Invalid payment details",
        });
        return;
      }

      // Find the account
      const account = accounts.find(
        (acc) => acc.id === paymentRequest.accountId
      );
      if (!account) {
        resolve({
          success: false,
          message: "Account not found",
        });
        return;
      }

      // Update account balance (in a real app, this would be a database update)
      account.balance += paymentRequest.amount;

      // Return success response
      resolve({
        success: true,
        transactionId: `T-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
      });
    }, 1000);
  });
};
