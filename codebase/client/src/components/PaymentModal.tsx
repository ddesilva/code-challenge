import React, { useState, useEffect } from "react";
import { EnergyAccount, PaymentRequest } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";

interface PaymentModalProps {
  account: EnergyAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: PaymentRequest) => Promise<void>;
  isSuccess: boolean;
}

interface PaymentFormValues {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  amount: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  account,
  isOpen,
  onClose,
  onSubmit,
  isSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      amount: "",
    },
  });

  // Reset form when modal opens with a new account
  useEffect(() => {
    if (account) {
      reset();
    }
  }, [account, reset]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Add space after every 4 digits
    let formatted = "";
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += digits[i];
    }

    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    e.target.value = formatted;
    setValue("cardNumber", formatted);
  };

  const processSubmit = async (data: PaymentFormValues) => {
    if (!account) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        accountId: account.id,
        cardNumber: data.cardNumber,
        cardholderName: data.cardholderName,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
        amount: parseFloat(data.amount),
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
        <DialogDescription className="sr-only">
          Payment form for your energy account
        </DialogDescription>
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

            <form
              onSubmit={handleSubmit(processSubmit)}
              className="space-y-4 py-4"
            >
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
                <Label
                  htmlFor="amount"
                  className={errors.amount ? "text-red-500" : ""}
                >
                  Payment Amount ($)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={errors.amount ? "border-red-500" : ""}
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 0.01,
                      message: "Amount must be at least $0.01",
                    },
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Enter a valid amount",
                    },
                  })}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cardNumber"
                  className={errors.cardNumber ? "text-red-500" : ""}
                >
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className={errors.cardNumber ? "border-red-500" : ""}
                  {...register("cardNumber", {
                    required: "Card number is required",
                    pattern: {
                      value: /^(\d{4}\s){3}\d{4}$/,
                      message: "Enter a valid 16-digit card number",
                    },
                    onChange: handleCardNumberChange,
                  })}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cardholderName"
                  className={errors.cardholderName ? "text-red-500" : ""}
                >
                  Cardholder Name
                </Label>
                <Input
                  id="cardholderName"
                  type="text"
                  placeholder="John Doe"
                  className={errors.cardholderName ? "border-red-500" : ""}
                  {...register("cardholderName", {
                    required: "Cardholder name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                />
                {errors.cardholderName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cardholderName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="expiryDate"
                    className={errors.expiryDate ? "text-red-500" : ""}
                  >
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    className={errors.expiryDate ? "border-red-500" : ""}
                    {...register("expiryDate", {
                      required: "Expiry date is required",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                        message: "Format: MM/YY",
                      },
                    })}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.expiryDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="cvv"
                    className={errors.cvv ? "text-red-500" : ""}
                  >
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    className={errors.cvv ? "border-red-500" : ""}
                    {...register("cvv", {
                      required: "CVV is required",
                      pattern: {
                        value: /^[0-9]{3,4}$/,
                        message: "3-4 digits only",
                      },
                    })}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.cvv.message}
                    </p>
                  )}
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
