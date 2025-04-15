import { EnergyAccount } from "@/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PaymentModal from "../../components/PaymentModal";

describe("PaymentModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockAccount: EnergyAccount = {
    id: "A-0001",
    type: "ELECTRICITY",
    balance: 30,
    address: "1 Greville Ct, Thomastown, 3076, Victoria",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders payment modal correctly", () => {
    render(
      <PaymentModal
        isOpen={true}
        onClose={mockOnClose}
        account={mockAccount}
        onSubmit={mockOnSubmit}
        isSuccess={false}
      />
    );

    expect(screen.getByText("Make a Payment")).toBeInTheDocument();
    expect(screen.getByLabelText("Card Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Payment Amount ($)")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiry Date")).toBeInTheDocument();
    expect(screen.getByLabelText("CVV")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pay" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("handles form input changes", () => {
    render(
      <PaymentModal
        isOpen={true}
        onClose={mockOnClose}
        account={mockAccount}
        onSubmit={mockOnSubmit}
        isSuccess={false}
      />
    );

    const cardNumberInput = screen.getByLabelText("Card Number");
    const cardholderNameInput = screen.getByLabelText("Cardholder Name");
    const expiryDateInput = screen.getByLabelText("Expiry Date");
    const cvvInput = screen.getByLabelText("CVV");
    const amountInput = screen.getByLabelText("Payment Amount ($)");

    fireEvent.change(cardNumberInput, {
      target: { value: "4111111111111111" },
    });
    fireEvent.change(cardholderNameInput, { target: { value: "John Doe" } });
    fireEvent.change(expiryDateInput, { target: { value: "12/25" } });
    fireEvent.change(cvvInput, { target: { value: "123" } });
    fireEvent.change(amountInput, { target: { value: "50" } });

    expect(cardNumberInput).toHaveValue("4111 1111 1111 1111");
    expect(cardholderNameInput).toHaveValue("John Doe");
    expect(expiryDateInput).toHaveValue("12/25");
    expect(cvvInput).toHaveValue("123");
    expect(amountInput).toHaveValue(50);
  });

  test("validates form inputs", async () => {
    render(
      <PaymentModal
        isOpen={true}
        onClose={mockOnClose}
        account={mockAccount}
        onSubmit={mockOnSubmit}
        isSuccess={false}
      />
    );

    const payButton = screen.getByRole("button", { name: "Pay" });

    // Try submitting with empty form
    fireEvent.click(payButton);

    // Wait for error messages to appear
    await waitFor(() => {
      expect(screen.getByText("Card number is required")).toBeInTheDocument();
    });

    // Fill in invalid card number
    const cardNumberInput = screen.getByLabelText("Card Number");
    fireEvent.change(cardNumberInput, { target: { value: "1234" } });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(
        screen.getByText("Enter a valid 16-digit card number")
      ).toBeInTheDocument();
    });
  });

  test("handles payment failure", async () => {
    render(
      <PaymentModal
        isOpen={true}
        onClose={mockOnClose}
        account={mockAccount}
        onSubmit={mockOnSubmit}
        isSuccess={false}
      />
    );

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText("Card Number"), {
      target: { value: "4111111111111111" },
    });
    fireEvent.change(screen.getByLabelText("Cardholder Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Expiry Date"), {
      target: { value: "12/25" },
    });
    fireEvent.change(screen.getByLabelText("CVV"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("Payment Amount ($)"), {
      target: { value: "50" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        accountId: mockAccount.id,
        cardNumber: "4111 1111 1111 1111",
        cardholderName: "John Doe",
        expiryDate: "12/25",
        cvv: "123",
        amount: 50,
      });
    });
  });

  test("closes modal when cancel button is clicked", () => {
    render(
      <PaymentModal
        isOpen={true}
        onClose={mockOnClose}
        account={mockAccount}
        onSubmit={mockOnSubmit}
        isSuccess={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
