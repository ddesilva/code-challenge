import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AccountCard from "../../components/AccountCard";
import { EnergyAccount } from "@/types";

describe("AccountCard Component", () => {
  const mockAccount: EnergyAccount = {
    id: "1",
    balance: 1000,
    type: "ELECTRICITY",
    address: "123 Main St, Anytown, USA",
  };

  const mockOnMakePayment = vi.fn();

  test("renders account information correctly", () => {
    render(
      <AccountCard account={mockAccount} onMakePayment={mockOnMakePayment} />
    );

    expect(screen.getByText("ELECTRICITY")).toBeInTheDocument();
    expect(screen.getByText("$1000.00 CR")).toBeInTheDocument();
    expect(screen.getByText("123 Main St, Anytown, USA")).toBeInTheDocument();
  });

  test("calls onMakePayment when payment button is clicked", () => {
    render(
      <AccountCard account={mockAccount} onMakePayment={mockOnMakePayment} />
    );

    fireEvent.click(screen.getByText("Make a payment"));
    expect(mockOnMakePayment).toHaveBeenCalledWith(mockAccount);
  });

  test("displays correct balance formatting and colors", () => {
    // Test credit balance
    const { rerender } = render(
      <AccountCard account={mockAccount} onMakePayment={mockOnMakePayment} />
    );
    expect(screen.getByText("$1000.00 CR")).toHaveClass("text-green-600");

    // Test debit balance
    const debitAccount = { ...mockAccount, balance: -500 };
    rerender(
      <AccountCard account={debitAccount} onMakePayment={mockOnMakePayment} />
    );
    expect(screen.getByText("$500.00")).toHaveClass("text-red-600");

    // Test zero balance
    const zeroAccount = { ...mockAccount, balance: 0 };
    rerender(
      <AccountCard account={zeroAccount} onMakePayment={mockOnMakePayment} />
    );
    expect(screen.getByText("$0.00")).toHaveClass("text-gray-500");
  });

  test("renders correct icon based on account type", () => {
    const { rerender } = render(
      <AccountCard account={mockAccount} onMakePayment={mockOnMakePayment} />
    );
    expect(screen.getByText("ELECTRICITY")).toBeInTheDocument();

    const gasAccount: EnergyAccount = { ...mockAccount, type: "GAS" };
    rerender(
      <AccountCard account={gasAccount} onMakePayment={mockOnMakePayment} />
    );
    expect(screen.getByText("GAS")).toBeInTheDocument();
  });
});
