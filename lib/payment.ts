"use client"

// Mock payment processing - replace with real payment gateway (Stripe, PayPal, etc.)
export interface PaymentDetails {
  cardNumber: string
  cardName: string
  expiry: string
  cvv: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

export async function processPayment(amount: number, paymentDetails: PaymentDetails): Promise<PaymentResult> {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))
  console.log('after delay');

  // Basic validation
  if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 13) {
    return {
      success: false,
      error: "Invalid card number",
    }
  }

  if (!paymentDetails.expiry || !paymentDetails.cvv) {
    return {
      success: false,
      error: "Missing payment details",
    }
  }

  console.log('returning mock success');
  // Mock successful payment
  return {
    success: true,
    transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  }
}

export function formatCardNumber(cardNumber: string): string {
  return cardNumber
    .replace(/\s/g, "")
    .replace(/(\d{4})/g, "$1 ")
    .trim()
}

export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, "")
  return /^\d{13,19}$/.test(cleaned)
}

export function validateExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false

  const month = Number.parseInt(match[1])
  const year = Number.parseInt(match[2]) + 2000

  if (month < 1 || month > 12) return false

  const now = new Date()
  const expiryDate = new Date(year, month - 1)

  return expiryDate > now
}

export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}
