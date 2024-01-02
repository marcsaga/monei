const locale = "es-ES";

export const useLocaleNumberFormatter = () => {
  const currencyFormatter = Intl.NumberFormat(locale, {
    currency: "EUR",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatCurrency = (amount: number) => {
    return currencyFormatter.format(amount);
  };

  const numberFormatter = Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatNumber = (amount: number) => {
    return numberFormatter.format(amount);
  };

  const decimalSeparator = numberFormatter.format(0.1).substring(1, 2);
  const thousandsSeparator = numberFormatter.format(10000).substring(2, 3);
  const currencyToNumber = (amount: string) => {
    return Number(
      amount.replace(thousandsSeparator, "").replace(decimalSeparator, "."),
    );
  };

  const removeThousandSeparator = (amount: string) => {
    return amount.replace(thousandsSeparator, "");
  };

  return {
    decimalSeparator,
    formatCurrency,
    formatNumber,
    currencyToNumber,
    removeThousandSeparator,
  };
};
