import React from "react";
import { Button } from "./ui/button";

interface AccountFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const AccountFilter: React.FC<AccountFilterProps> = ({
  selectedType,
  onTypeChange,
}) => {
  return (
    <div className="flex justify-center space-x-2 mb-8">
      <Button
        variant={selectedType === "ALL" ? "default" : "outline"}
        onClick={() => onTypeChange("ALL")}
      >
        All Accounts
      </Button>
      <Button
        variant={selectedType === "ELECTRICITY" ? "default" : "outline"}
        onClick={() => onTypeChange("ELECTRICITY")}
      >
        Electricity
      </Button>
      <Button
        variant={selectedType === "GAS" ? "default" : "outline"}
        onClick={() => onTypeChange("GAS")}
      >
        Gas
      </Button>
    </div>
  );
};

export default AccountFilter;
