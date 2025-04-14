import React from "react";
import { EnergyAccount } from "../types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Zap, Flame } from "lucide-react";

interface AccountCardProps {
  account: EnergyAccount;
  onMakePayment: (account: EnergyAccount) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onMakePayment,
}) => {
  // Determine if balance is credit (CR) or debit (DR)
  const isCredit = account.balance > 0;
  const isZero = account.balance === 0;
  const balanceText = `$${Math.abs(account.balance).toFixed(2)} ${
    isCredit ? "CR" : ""
  }`;

  // Get the appropriate color for the balance
  const getBalanceColor = () => {
    if (isZero) return "text-gray-500";
    if (isCredit) return "text-green-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6 p-6 border-2">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
          {account.type === "ELECTRICITY" ? (
            <Zap className="h-8 w-8 text-gray-700" />
          ) : (
            <Flame className="h-8 w-8 text-gray-700" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{account.type}</h2>
          <p className="text-lg font-medium mb-1">{account.id}</p>
          <p className="text-gray-600 mb-6">{account.address}</p>

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Account Balance</span>
            <span className={`text-xl font-bold ${getBalanceColor()}`}>
              {balanceText}
            </span>
          </div>

          <div className="mt-4">
            <Button
              onClick={() => onMakePayment(account)}
              className="w-full text-red-600 bg-white hover:bg-gray-100 border border-red-600"
              variant="outline"
            >
              Make a payment
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AccountCard;
