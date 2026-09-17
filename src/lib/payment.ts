export type PaymentMethod = 'card' | 'bank_transfer' | 'paypal' | 'crypto' | 'cash_on_collection';

export type PaymentOptionState = 'available' | 'requires_configuration' | 'collection_only';

export interface PaymentOption {
  value: PaymentMethod;
  label: string;
  description: string;
  active: boolean;
  state: PaymentOptionState;
}

export function getPaymentOptions(orderType: 'delivery' | 'collection'): PaymentOption[] {
  const cardConfigured = Boolean(process.env.NEXT_PUBLIC_PAYMENT_PROVIDER && process.env.NEXT_PUBLIC_PAYMENT_PROVIDER !== '');
  const paypalConfigured = Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET);
  const bankConfigured = Boolean(process.env.NEXT_PUBLIC_BANK_NAME || process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME);
  const cryptoConfigured = Boolean(process.env.NEXT_PUBLIC_CRYPTO_WALLET_ADDRESS || process.env.NEXT_PUBLIC_BINANCE_WALLET_ADDRESS);

  const methods: PaymentOption[] = [
    {
      value: 'card',
      label: 'Card payment',
      description: cardConfigured ? 'Secure card payment via the configured provider.' : 'Requires payment provider configuration before this option is active.',
      active: cardConfigured,
      state: cardConfigured ? 'available' : 'requires_configuration',
    },
    {
      value: 'bank_transfer',
      label: 'Bank transfer',
      description: bankConfigured ? 'Pay via bank transfer and upload/confirm your reference after ordering.' : 'Admin payment instructions need to be configured before this option is available.',
      active: bankConfigured,
      state: bankConfigured ? 'available' : 'requires_configuration',
    },
    {
      value: 'paypal',
      label: 'PayPal',
      description: paypalConfigured ? 'PayPal checkout is active.' : 'PayPal integration is not configured for this store yet.',
      active: paypalConfigured,
      state: paypalConfigured ? 'available' : 'requires_configuration',
    },
    {
      value: 'crypto',
      label: 'Crypto / Binance',
      description: cryptoConfigured ? 'Public wallet information is configured for customer verification.' : 'Crypto payment instructions must be configured by the administrator.',
      active: cryptoConfigured,
      state: cryptoConfigured ? 'available' : 'requires_configuration',
    },
    {
      value: 'cash_on_collection',
      label: 'Cash on collection',
      description: 'Pay in cash when you collect your order from Bagma.',
      active: orderType === 'collection',
      state: orderType === 'collection' ? 'collection_only' : 'requires_configuration',
    },
  ];

  return methods.filter((method) => {
    if (method.value === 'cash_on_collection') {
      return orderType === 'collection';
    }

    return true;
  });
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Payment pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    awaiting_verification: 'Awaiting verification',
  };

  return labels[status] ?? 'Pending';
}
