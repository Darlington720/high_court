import { supabase } from './supabase';

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'subscription' | 'one-time' | 'refund';
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
  date: string;
  metadata: {
    cardBrand?: string;
    cardLast4?: string;
    provider?: string;
    mobileNumber?: string;
    bankName?: string;
    bankReference?: string;
  };
}

export async function fetchPayments() {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        users:user_id (
          id,
          email,
          role,
          subscription_tier
        ),
        payment_methods:payment_method_id (
          type,
          details
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match the Payment interface
    return payments.map(payment => ({
      id: payment.id,
      userId: payment.user_id,
      userName: payment.users?.email?.split('@')[0] || 'Unknown User',
      userEmail: payment.users?.email || 'unknown@example.com',
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      type: payment.metadata?.type || 'one-time',
      paymentMethod: payment.payment_methods?.type || 'card',
      date: payment.created_at,
      metadata: {
        cardBrand: payment.payment_methods?.details?.brand,
        cardLast4: payment.payment_methods?.details?.last4,
        provider: payment.payment_methods?.details?.provider,
        mobileNumber: payment.payment_methods?.details?.phone_number,
        bankName: payment.payment_methods?.details?.bank_name,
        bankReference: payment.payment_methods?.details?.reference
      }
    }));
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
}

export async function getPaymentStats() {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*');

    if (error) throw error;

    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const successRate = (completedPayments.length / payments.length) * 100;

    return {
      totalRevenue,
      successRate,
      averageAmount: totalRevenue / (completedPayments.length || 1),
      refundRate: (payments.filter(p => p.status === 'refunded').length / payments.length) * 100
    };
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw error;
  }
}

export async function refundPayment(paymentId: string) {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        metadata: {
          refunded_at: new Date().toISOString()
        }
      })
      .eq('id', paymentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error refunding payment:', error);
    throw error;
  }
}

export async function updatePaymentStatus(paymentId: string, status: Payment['status']) {
  try {
    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}