
export function useFormatNumber() {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (number: number, decimals = 2): string => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  };

  const formatPercentage = (number: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number / 100);
  };

  return { formatCurrency, formatNumber, formatPercentage };
}
