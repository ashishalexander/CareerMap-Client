

// types/subscription.ts
export interface Transaction {
  date: string;
  transactionId: string;
  planType: string;  
  billingCycle: string;
  amount: number;
}

export interface SubscriptionData {
  planType: string;
  billingCycle: string;
  isActive: boolean;
  endDate: string;
  paymentHistory: Transaction[];
}