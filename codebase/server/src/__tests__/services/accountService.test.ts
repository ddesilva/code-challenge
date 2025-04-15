import { getAccounts, processPayment } from "../../services/accountService";
import { PaymentRequest, PaymentResponse } from "../../models/types";

// Mock the setTimeout function
jest.useFakeTimers();

describe("Account Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAccounts", () => {
    test("returns accounts", async () => {
      // Create a promise to capture the resolved value
      const accountsPromise = getAccounts();

      // Fast-forward timers to resolve the promise
      jest.runAllTimers();

      // Wait for the promise to resolve
      const accounts = await accountsPromise;

      // Verify we got an array of accounts
      expect(Array.isArray(accounts)).toBe(true);
      expect(accounts.length).toBeGreaterThan(0);

      // Check that each account has the expected structure
      accounts.forEach((account) => {
        expect(account).toHaveProperty("id");
        expect(account).toHaveProperty("type");
        expect(account).toHaveProperty("balance");
        expect(account).toHaveProperty("address");
      });
    });
  });

  describe("processPayment", () => {
    test("successfully processes valid payment", async () => {
      const paymentRequest: PaymentRequest = {
        accountId: "A-0001",
        amount: 100,
        cardNumber: "4111111111111111",
        cardholderName: "Test User",
        expiryDate: "12/25",
        cvv: "123",
      };

      const paymentPromise = processPayment(paymentRequest);

      // Fast-forward timers
      jest.runAllTimers();

      const result = await paymentPromise;

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
    });

    test("rejects payment with invalid details", async () => {
      const paymentRequest: PaymentRequest = {
        accountId: "A-0001",
        amount: 100,
        cardNumber: "", // Invalid card number
        cardholderName: "Test User",
        expiryDate: "12/25",
        cvv: "123",
      };

      const paymentPromise = processPayment(paymentRequest);

      // Fast-forward timers
      jest.runAllTimers();

      const result = await paymentPromise;

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid payment details");
    });

    test("rejects payment for non-existent account", async () => {
      const paymentRequest: PaymentRequest = {
        accountId: "NON-EXISTENT",
        amount: 100,
        cardNumber: "4111111111111111",
        cardholderName: "Test User",
        expiryDate: "12/25",
        cvv: "123",
      };

      const paymentPromise = processPayment(paymentRequest);

      // Fast-forward timers
      jest.runAllTimers();

      const result = await paymentPromise;

      expect(result.success).toBe(false);
      expect(result.message).toBe("Account not found");
    });
  });
});
