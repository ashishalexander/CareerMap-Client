import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { User } from '../Types/subscription';
import { Calendar, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TransactionHistoryModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionHistoryModal = ({ user, open, onOpenChange }: TransactionHistoryModalProps) => {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
        </DialogHeader>
        
        {/* User Info Card */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">User Details</h3>
                <p className="text-sm text-gray-600">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Current Plan</h3>
                <p className="text-sm text-gray-600">{user.subscription?.planType}</p>
                <p className="text-sm text-gray-600">{user.subscription?.billingCycle} billing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.subscription?.paymentHistory.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${transaction.amount}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{transaction.planType}</div>
                      <div className="text-gray-500">{transaction.billingCycle}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <span className={`text-sm ${
                        transaction.status === 'successful' ? 'text-green-600' :
                        transaction.status === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {transaction.status || 'successful'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      {transaction.paymentMethod || 'Credit Card'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionHistoryModal;