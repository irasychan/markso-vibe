// Monetary formatting helpers for the app
// Decision: currency=HKD, locale=en-HK, internal_unit=dollar_decimal

const hkdFormatter = new Intl.NumberFormat('en-HK', {
	style: 'currency',
	currency: 'HKD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

/** Format a numeric amount (already validated) into localized HKD currency string. */
export function formatCurrencyHKD(amount: number): string {
	return hkdFormatter.format(amount);
}

