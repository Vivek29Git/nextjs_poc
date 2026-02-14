"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Lock } from "lucide-react"
import { formatCardNumber, validateCardNumber, validateExpiry, validateCVV } from "@/lib/payment"

interface PaymentFormProps {
  paymentInfo: {
    cardNumber: string
    cardName: string
    expiry: string
    cvv: string
  }
  setPaymentInfo: (info: any) => void
}

export function PaymentForm({ paymentInfo, setPaymentInfo }: PaymentFormProps) {
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setPaymentInfo({ ...paymentInfo, cardNumber: formatted })

    if (formatted.length > 0 && !validateCardNumber(formatted)) {
      setErrors({ ...errors, cardNumber: "Invalid card number" })
    } else {
      setErrors({ ...errors, cardNumber: "" })
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setPaymentInfo({ ...paymentInfo, expiry: value })

    if (value.length === 5 && !validateExpiry(value)) {
      setErrors({ ...errors, expiry: "Invalid or expired date" })
    } else {
      setErrors({ ...errors, expiry: "" })
    }
  }

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setPaymentInfo({ ...paymentInfo, cvv: value })

    if (value.length > 0 && !validateCVV(value)) {
      setErrors({ ...errors, cvv: "Invalid CVV" })
    } else {
      setErrors({ ...errors, cvv: "" })
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-serif text-2xl flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number *</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            required
            value={paymentInfo.cardNumber}
            onChange={handleCardNumberChange}
            className={`bg-background ${errors.cardNumber ? "border-destructive" : ""}`}
            maxLength={19}
          />
          {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardName">Cardholder Name *</Label>
          <Input
            id="cardName"
            placeholder="John Doe"
            required
            value={paymentInfo.cardName}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
            className="bg-background"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date *</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              required
              value={paymentInfo.expiry}
              onChange={handleExpiryChange}
              className={`bg-background ${errors.expiry ? "border-destructive" : ""}`}
              maxLength={5}
            />
            {errors.expiry && <p className="text-xs text-destructive">{errors.expiry}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV *</Label>
            <Input
              id="cvv"
              placeholder="123"
              required
              value={paymentInfo.cvv}
              onChange={handleCVVChange}
              className={`bg-background ${errors.cvv ? "border-destructive" : ""}`}
              maxLength={4}
              type="password"
            />
            {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <Lock className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            By placing your order, you agree to our terms and conditions. Your card will be charged immediately upon
            order confirmation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
