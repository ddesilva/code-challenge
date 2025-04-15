import { Request, Response } from "express";
import {
  getAccountsController,
  processPaymentController,
} from "../../controllers/accountController";
import * as accountService from "../../services/accountService";
import { EnergyAccount, PaymentResponse } from "../../models/types";

// Mock the account service
jest.mock("../../services/accountService");

describe("Account Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getAccountsController", () => {
    test("returns accounts", async () => {
      const mockAccounts: EnergyAccount[] = [
        {
          id: "A-0001",
          type: "ELECTRICITY",
          balance: 30,
          address: "1 Greville Ct, Thomastown, 3076, Victoria",
        },
      ];

      jest
        .spyOn(accountService, "getAccounts")
        .mockResolvedValueOnce(mockAccounts);

      await getAccountsController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(accountService.getAccounts).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockAccounts);
    });

    test("handles service errors", async () => {
      const errorMessage = "Service error";
      jest
        .spyOn(accountService, "getAccounts")
        .mockRejectedValueOnce(new Error(errorMessage));

      await getAccountsController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Failed to fetch accounts",
      });
    });
  });

  describe("processPaymentController", () => {
    test("successfully processes payment", async () => {
      const mockPaymentRequest = {
        accountId: "A-0001",
        amount: 100,
        cardNumber: "4111111111111111",
        cardholderName: "Test User",
        expiryDate: "12/25",
        cvv: "123",
      };

      const mockPaymentResponse: PaymentResponse = {
        success: true,
        transactionId: "T-1234",
      };

      mockRequest.body = mockPaymentRequest;
      jest
        .spyOn(accountService, "processPayment")
        .mockResolvedValueOnce(mockPaymentResponse);

      await processPaymentController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(accountService.processPayment).toHaveBeenCalledWith(
        mockPaymentRequest
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockPaymentResponse);
    });

    test("handles payment failure", async () => {
      const mockPaymentRequest = {
        accountId: "A-0001",
        amount: 100,
        cardNumber: "", // Invalid card number
        cardholderName: "Test User",
        expiryDate: "12/25",
        cvv: "123",
      };

      const mockPaymentResponse: PaymentResponse = {
        success: false,
        message: "Invalid payment details",
      };

      mockRequest.body = mockPaymentRequest;
      jest
        .spyOn(accountService, "processPayment")
        .mockResolvedValueOnce(mockPaymentResponse);

      await processPaymentController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(mockPaymentResponse);
    });
  });
});
