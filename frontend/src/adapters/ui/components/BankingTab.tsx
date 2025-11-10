import { useState } from "react";
import { useBanking } from "../hooks/useBanking";
import React from "react";

// --- TYPE DEFINITIONS START ---

interface TransactionResult {
  shipId: string;
  year: number;
  amount?: number;
  applied?: number;
}

interface BankingHook {
  loading: boolean;
  result: TransactionResult | null;
  error: string | null; // ✅ added missing prop
  handleBank: (shipId: string, year: number, amount: number) => void;
  handleApply: (shipId: string, year: number, amount: number) => void;
}

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  color: "green" | "blue";
  loading: boolean;
  isFormValid: boolean;
}

interface FormInputProps {
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number";
  min?: number;
}
// --- TYPE DEFINITIONS END ---

const Spinner: React.FC = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  color,
  loading,
  isFormValid,
}) => (
  <button
    disabled={loading || !isFormValid}
    onClick={onClick}
    className={`
      flex-1 flex items-center justify-center min-w-[200px]
      px-6 py-3 text-white text-base font-bold rounded-xl shadow-lg
      transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
      disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
      ${
        color === "green"
          ? "bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-green-300/50"
          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-300/50"
      }
    `}
  >
    {loading ? <Spinner /> : label}
  </button>
);

const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  value,
  onChange,
  type = "text",
  min,
}) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      min={min}
      onChange={onChange}
      className="w-full p-4 border-2 border-gray-200 rounded-xl shadow-inner
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-all duration-200 text-gray-800 placeholder-gray-500 font-medium"
      aria-label={placeholder}
    />
  </div>
);

export default function BankingTab() {
  // ✅ now includes error from the hook
  const { loading, result, error, handleBank, handleApply } = useBanking() as BankingHook;

  const [shipId, setShipId] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear() + 1);
  const [amount, setAmount] = useState<number>(0);

  const isFormValid = shipId.trim() !== "" && amount > 0;

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight border-b border-gray-300 pb-4">
        Carbon Banking & Allocation
      </h2>

      {/* Input and Action Card */}
      <div className="p-6 md:p-10 bg-white rounded-3xl border border-gray-200 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🚢</span> Transaction Setup
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FormInput
            placeholder="Ship ID (e.g., MV-APOLLO-01)"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
          />
          <FormInput
            type="number"
            placeholder="Target Year (e.g., 2025)"
            value={year}
            min={2024}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <FormInput
            type="number"
            placeholder="Amount (in gCO₂eq)"
            value={amount}
            min={0}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        {!isFormValid && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 border-l-4 border-red-500 rounded-md text-sm font-medium">
            Please enter a valid Ship ID and a positive Carbon Amount before proceeding.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-5 pt-6 border-t border-gray-100">
          <ActionButton
            label="Bank Carbon Credit (Deposit)"
            color="green"
            loading={loading}
            isFormValid={isFormValid}
            onClick={() => handleBank(shipId, year, amount)}
          />
          <ActionButton
            label="Apply Carbon Debit (Withdraw)"
            color="blue"
            loading={loading}
            isFormValid={isFormValid}
            onClick={() => handleApply(shipId, year, amount)}
          />
        </div>
      </div>

      {/* ✅ Show Result */}
      {result && (
        <div className="p-6 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold mb-4 flex items-center border-b border-blue-200 pb-2">
            <span className="mr-2 text-2xl">📊</span> Transaction Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Ship ID</p>
              <p className="text-lg font-semibold">{result.shipId}</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Year</p>
              <p className="text-lg font-semibold">{result.year}</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Type & Amount</p>
              <p
                className={`text-xl font-extrabold ${
                  result.applied ? "text-red-600" : "text-green-600"
                }`}
              >
                {result.applied ? "DEBIT:" : "CREDIT:"}{" "}
                {result.amount || result.applied} gCO₂eq
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm italic text-blue-700">
            Transaction successfully recorded on the ledger.
          </p>
        </div>
      )}

      {/* ✅ Human-readable error card */}
      {error && (
        <div className="p-4 mt-4 bg-red-100 text-red-800 border-l-4 border-red-500 rounded-md shadow-sm">
          <p className="font-semibold">⚠️ {error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center p-4 text-lg font-medium text-gray-600">
          Processing transaction... Please wait.
        </div>
      )}
    </div>
  );
}
