export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function formatCurrency(
  amount: number,
  currency: string = "INR",
  compact: boolean = false
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";
  const absAmount = Math.abs(amount);

  if (compact && absAmount >= 10000000) {
    return `${amount < 0 ? "-" : ""}${symbol}${(absAmount / 10000000).toFixed(2)} Cr`;
  }
  if (compact && absAmount >= 100000) {
    return `${amount < 0 ? "-" : ""}${symbol}${(absAmount / 100000).toFixed(2)} L`;
  }
  if (compact && absAmount >= 1000) {
    return `${amount < 0 ? "-" : ""}${symbol}${(absAmount / 1000).toFixed(1)}k`;
  }

  // Standard Indian or International numbering
  const formatted = new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
}
