export function v4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    IDR: 'Rp',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    SGD: 'S$',
    MYR: 'RM',
    AUD: 'A$',
    CNY: '¥',
  }
  const symbol = symbols[currency] || currency
  const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  return `${symbol}${formatted}`
}
