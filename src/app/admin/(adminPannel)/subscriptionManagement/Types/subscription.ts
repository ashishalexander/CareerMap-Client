

// Basic subscription-related types
export type PlanType = 'Professional' | 'Recruiter-pro' | 'Ordinary';
export type BillingCycle = 'monthly' | 'yearly' | 'quarterly';
export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'cancelled';
export type TimeframeType = 'All Time'|'Yearly' | 'weekly' | 'monthly';

// Transaction details
export interface Transaction {
  date: string;
  transactionId: string;
  planType: PlanType;
  billingCycle: BillingCycle;
  amount: number;
  status?: 'successful' | 'failed' | 'pending';
  paymentMethod?: string;
}

// Main subscription data interface
export interface SubscriptionData {
  planType: PlanType;
  billingCycle: BillingCycle;
  isActive: boolean;
  startDate: string;
  endDate: string;
  autoRenew?: boolean;
  lastBillingDate?: string;
  nextBillingDate?: string;
  paymentHistory: Transaction[];
  status: SubscriptionStatus;
}

// Component Props Types
export interface SubscriptionStatusProps {
  data: SubscriptionData | null;
}

export interface TimeRemainingProps {
  endDate: string;
  calculateDaysLeft: (endDate: string) => number;
}

export interface TransactionHistoryProps {
  paymentHistory?: Transaction[];
}

// API Request/Response Types
export interface UpdateSubscriptionRequest {
  planType?: PlanType;
  billingCycle?: BillingCycle;
  autoRenew?: boolean;
  isActive?: boolean;
}

export interface SubscriptionResponse {
  success: boolean;
  data: SubscriptionData;
  message?: string;
}

export interface SubscriptionError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// User related types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subscription?: SubscriptionData;
}

// Redux State Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}


// Utility Types
export type DateString = string; // ISO 8601 format
export type Currency = 'USD' | 'EUR' | 'GBP'  ;

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface FilterParams {
  search?: string;
  planType?: PlanType;
  billingCycle?: BillingCycle;
  status?: SubscriptionStatus;
  startDate?: DateString;
  endDate?: DateString;
}