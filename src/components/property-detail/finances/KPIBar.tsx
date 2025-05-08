
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface KPIBarProps {
  rent: number;
  expenses: number;
  netIncome: number;
  onExpensesClick?: () => void;
  showExpenses?: boolean;
}

const KPIBar = ({ rent, expenses, netIncome, onExpensesClick, showExpenses }: KPIBarProps) => {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4 w-full justify-between">
      <div className="flex-1 min-w-[90px] bg-muted rounded-lg px-3 py-2 text-center">
        <div className="text-xs font-medium text-muted-foreground">Ingreso</div>
        <div className="text-lg md:text-xl font-bold text-green-600">{rent?.toFixed(0)}€</div>
      </div>
      <div 
        className="flex-1 min-w-[90px] bg-muted rounded-lg px-3 py-2 text-center cursor-pointer hover:bg-red-50 group transition"
        onClick={onExpensesClick}
      >
        <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
          Gastos
          {showExpenses ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </div>
        <div className="text-lg md:text-xl font-bold text-red-600 group-hover:underline">{expenses?.toFixed(0)}€</div>
      </div>
      <div className="flex-1 min-w-[90px] bg-muted rounded-lg px-3 py-2 text-center">
        <div className="text-xs font-medium text-muted-foreground">Neto</div>
        <div className="text-lg md:text-xl font-bold text-blue-600">{netIncome?.toFixed(0)}€</div>
      </div>
    </div>
  );
};

export default KPIBar;
