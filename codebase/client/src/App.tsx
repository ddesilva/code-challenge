import { useEffect, useState } from "react";
import AccountCard from "./components/AccountCard";
import AccountFilter from "./components/AccountFilter";
import PaymentModal from "./components/PaymentModal";
import { fetchAccounts, makePayment } from "./services/api";
import { EnergyAccount, PaymentRequest } from "./types";

function App() {
  const [accounts, setAccounts] = useState<EnergyAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<EnergyAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<EnergyAccount | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("ALL");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAccounts();
        setAccounts(data);
        setFilteredAccounts(data);
      } catch (err) {
        setError("Failed to load accounts. Please try again later.");
        console.error("Error loading accounts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  useEffect(() => {
    if (filterType === "ALL") {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(
        accounts.filter((account) => account.type === filterType)
      );
    }
  }, [filterType, accounts]);

  const handleMakePayment = (account: EnergyAccount) => {
    setSelectedAccount(account);
    setIsPaymentSuccess(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset after animation completes
    setTimeout(() => {
      setSelectedAccount(null);
      setIsPaymentSuccess(false);
    }, 300);
  };

  const handleSubmitPayment = async (paymentData: PaymentRequest) => {
    try {
      const response = await makePayment(paymentData);

      if (response.success) {
        setIsPaymentSuccess(true);

        // Update the account balance in the local state
        const updatedAccounts = accounts.map((acc) => {
          if (acc.id === paymentData.accountId) {
            return {
              ...acc,
              balance: acc.balance - paymentData.amount,
            };
          }
          return acc;
        });

        setAccounts(updatedAccounts);
      } else {
        throw new Error(response.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Energy Accounts</h1>
      </header>

      <AccountFilter selectedType={filterType} onTypeChange={setFilterType} />

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 text-center">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading accounts...
          </div>
        ) : filteredAccounts.length === 0 ? (
          <p className="text-center py-8">No accounts found.</p>
        ) : (
          filteredAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onMakePayment={handleMakePayment}
            />
          ))
        )}
      </div>

      <PaymentModal
        account={selectedAccount}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPayment}
        isSuccess={isPaymentSuccess}
      />
    </div>
  );
}

export default App;
