

// types/subscription.ts
export interface Transaction {
  date: string;
  _id: string;
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