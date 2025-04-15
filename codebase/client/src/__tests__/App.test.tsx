import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../App";
import * as apiService from "../services/api";

// Silence React act() warnings
// This is a workaround for the warnings that occur when state updates happen after tests
// In a real project, you'd want to fix the underlying issues, but this helps for now
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock the API service module
vi.mock("../services/api", () => ({
  fetchAccounts: vi.fn(),
  makePayment: vi.fn(),
}));

const mockAccounts = [
  {
    id: "1",
    name: "Home Energy",
    type: "ELECTRICITY",
    balance: 75.4,
    dueDate: "2023-12-15",
    address: "123 Main St",
  },
  {
    id: "2",
    name: "Business Gas",
    type: "GAS",
    balance: 120.0,
    dueDate: "2023-12-20",
    address: "456 Commerce Ave",
  },
];

// Helper function to wait for all pending promises
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up API service mocks
    (apiService.fetchAccounts as jest.Mock).mockResolvedValue(mockAccounts);
    (apiService.makePayment as jest.Mock).mockResolvedValue({ success: true });
  });

  test("renders loading state initially", () => {
    render(<App />);
    expect(screen.getByText("Loading accounts...")).toBeInTheDocument();
  });

  test("renders accounts after loading", async () => {
    render(<App />);

    // Wait for all promises to resolve
    await flushPromises();

    await waitFor(() => {
      expect(screen.queryByText("Loading accounts...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("ELECTRICITY")).toBeInTheDocument();
    expect(screen.getByText("GAS")).toBeInTheDocument();
  });

  test("displays error message when fetch fails", async () => {
    // Override the default mock for this test only
    (apiService.fetchAccounts as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load accounts. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  test("filters accounts by type", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading accounts...")).not.toBeInTheDocument();
    });

    // Initially both accounts should be visible
    expect(screen.getByText("ELECTRICITY")).toBeInTheDocument();
    expect(screen.getByText("GAS")).toBeInTheDocument();

    // Filter by ELECTRICITY
    await user.click(screen.getByText("Electricity"));

    expect(screen.getByText("ELECTRICITY")).toBeInTheDocument();
    expect(screen.queryByText("GAS")).not.toBeInTheDocument();

    // Filter by GAS
    await user.click(screen.getByText("Gas"));

    expect(screen.queryByText("ELECTRICITY")).not.toBeInTheDocument();
    expect(screen.getByText("GAS")).toBeInTheDocument();

    // Reset filter to ALL
    await user.click(screen.getByText("All Accounts"));

    expect(screen.getByText("ELECTRICITY")).toBeInTheDocument();
    expect(screen.getByText("GAS")).toBeInTheDocument();
  });

  test("opens payment modal when Make Payment is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading accounts...")).not.toBeInTheDocument();
    });

    // Find and click the first "Make Payment" button
    const makePaymentButton = screen.getAllByRole("button", {
      name: /make a payment/i,
    })[0];
    await user.click(makePaymentButton);

    // Check if modal is open
    expect(screen.getByText("Make a Payment")).toBeInTheDocument();
  });

  test("handles successful payment submission", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading accounts...")).not.toBeInTheDocument();
    });

    // Open payment modal
    const makePaymentButton = screen.getAllByRole("button", {
      name: /make a payment/i,
    })[0];
    await user.click(makePaymentButton);

    // Fill payment form
    await user.type(screen.getByLabelText(/Payment Amount/i), "50");
    await user.type(
      screen.getByLabelText(/Card Number/i),
      "1234 5678 9012 3456"
    );
    await user.type(screen.getByLabelText(/Cardholder Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Expiry Date/i), "12/25");
    await user.type(screen.getByLabelText(/CVV/i), "123");

    // Submit payment
    await user.click(screen.getByRole("button", { name: /Pay/i }));

    await waitFor(() => {
      // Check if makePayment was called with the correct data
      expect(apiService.makePayment).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: "1",
          amount: 50,
          cardNumber: "1234 5678 9012 3456",
          cardholderName: "John Doe",
          expiryDate: "12/25",
          cvv: "123",
        })
      );

      // Check if success message is shown
      expect(screen.getByText("Payment Successful!")).toBeInTheDocument();

      // Check if accounts were refreshed
      expect(apiService.fetchAccounts).toHaveBeenCalledTimes(2);
    });
  });

  test("handles payment failure", async () => {
    // Mock payment failure for this test only
    (apiService.makePayment as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: "Payment failed",
    });

    // Spy on window.alert
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading accounts...")).not.toBeInTheDocument();
    });

    // Open payment modal
    const makePaymentButton = screen.getAllByRole("button", {
      name: /make a payment/i,
    })[0];
    await user.click(makePaymentButton);

    // Fill payment form
    await user.type(screen.getByLabelText(/Payment Amount/i), "50");
    await user.type(
      screen.getByLabelText(/Card Number/i),
      "1234 5678 9012 3456"
    );
    await user.type(screen.getByLabelText(/Cardholder Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Expiry Date/i), "12/25");
    await user.type(screen.getByLabelText(/CVV/i), "123");

    // Submit payment
    await user.click(screen.getByRole("button", { name: /Pay/i }));

    await waitFor(() => {
      // Check if alert was shown
      expect(alertSpy).toHaveBeenCalledWith(
        "Payment failed. Please try again."
      );
    });

    alertSpy.mockRestore();
  });

  test("closes modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading accounts...")).not.toBeInTheDocument();
    });

    // Open payment modal
    const makePaymentButton = screen.getAllByRole("button", {
      name: /make a payment/i,
    })[0];
    await user.click(makePaymentButton);

    // Check if modal is open
    expect(screen.getByText("Make a Payment")).toBeInTheDocument();

    // Close the modal
    await user.click(screen.getByRole("button", { name: /Cancel/i }));

    // Check if modal is closed
    await waitFor(() => {
      expect(screen.queryByText("Make a Payment")).not.toBeInTheDocument();
    });
  });
});
