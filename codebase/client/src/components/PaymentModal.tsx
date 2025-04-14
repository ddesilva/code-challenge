import React, { useState } from "react";
import { EnergyAccount, PaymentRequest } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CheckCircle } from "lucide-react";

interface PaymentModalProps {
  account: EnergyAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: PaymentRequest) => Promise<void>;
  isSuccess: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  account,
  isOpen,
  onClose,
  onSubmit,
  isSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens with a new account
  React.useEffect(() => {
    if (account) {
      setCardNumber("");
      setCardholderName("");
      setExpiryDate("");
      setCvv("");
      setAmount("");
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        accountId: account.id,
        cardNumber,
        cardholderName,
        expiryDate,
        cvv,
        amount: parseFloat(amount),
      });
    } catch (error) {
      console.error("Payment submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {isSuccess ? (
          <div className="flex flex-col items-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-center text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Make a Payment</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account ID:</span>
                  <span className="font-semibold">{account.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Balance:</span>
                  <span
                    className={`font-semibold ${
                      account.balance > 0
                        ? "text-green-600"
                        : account.balance < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    ${account.balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Payment Amount ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Card Number</label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cardholder Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CVV</label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Pay"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
