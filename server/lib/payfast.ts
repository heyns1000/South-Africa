import crypto from "crypto";

const merchantId = process.env.PAYFAST_MERCHANT_ID || "";
const merchantKey = process.env.PAYFAST_MERCHANT_KEY || "";
const passphrase = process.env.PAYFAST_PASSPHRASE || "";
const mode = process.env.PAYFAST_MODE || "sandbox";

export interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
}

export function getPayFastUrl() {
  return mode === "live"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";
}

export function generateSignature(data: Record<string, any>, includePassphrase: boolean = true): string {
  // Create parameter string
  const params = Object.keys(data)
    .filter(key => data[key] !== "" && data[key] !== null && data[key] !== undefined)
    .sort()
    .map(key => `${key}=${encodeURIComponent(String(data[key]).trim())}`)
    .join("&");

  // Add passphrase if required
  const signatureString = includePassphrase && passphrase
    ? `${params}&passphrase=${encodeURIComponent(passphrase.trim())}`
    : params;

  // Generate signature
  return crypto.createHash("md5").update(signatureString).digest("hex");
}

export function createPayFastPayment(
  amount: string,
  itemName: string,
  orderId: string,
  returnUrl: string,
  cancelUrl: string,
  notifyUrl: string
): PayFastPaymentData & { signature: string } {
  if (!merchantId || !merchantKey) {
    throw new Error("PayFast credentials not configured");
  }

  const paymentData: PayFastPaymentData = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    m_payment_id: orderId,
    amount: amount,
    item_name: itemName,
  };

  const signature = generateSignature(paymentData, true);

  return {
    ...paymentData,
    signature,
  };
}

export function verifyPayFastSignature(data: Record<string, any>, receivedSignature: string): boolean {
  // Remove signature from data
  const { signature, ...paymentData } = data;

  // Generate expected signature
  const expectedSignature = generateSignature(paymentData, true);

  return expectedSignature === receivedSignature;
}

export function isPayFastConfigured(): boolean {
  return !!(merchantId && merchantKey);
}
