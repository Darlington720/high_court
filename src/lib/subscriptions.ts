import { supabase } from './supabase';

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended' | 'expired';
  startDate: string;
  endDate: string;
  lastPayment: string;
  amount: number;
  autoRenew: boolean;
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
  metadata?: {
    cardLast4?: string;
    cardBrand?: string;
    mobileNumber?: string;
    provider?: string;
  };
}

export async function fetchSubscriptions() {
  try {
    // Get all subscriptions with user details
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
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

    // Transform data to match the Subscription interface
    return subscriptions.map(sub => ({
      id: sub.id,
      userId: sub.user_id,
      userName: sub.users?.email?.split('@')[0] || 'Unknown User',
      userEmail: sub.users?.email || 'unknown@example.com',
      plan: sub.users?.subscription_tier || 'none',
      status: sub.status,
      startDate: sub.current_period_start,
      endDate: sub.current_period_end,
      lastPayment: sub.created_at,
      amount: sub.metadata?.amount || 0,
      autoRenew: !sub.cancel_at_period_end,
      paymentMethod: sub.payment_methods?.type || 'card',
      metadata: {
        cardLast4: sub.payment_methods?.details?.last4,
        cardBrand: sub.payment_methods?.details?.brand,
        mobileNumber: sub.payment_methods?.details?.phone_number,
        provider: sub.payment_methods?.details?.provider
      }
    }));
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
}

export async function updateSubscription(id: string, updates: Partial<Subscription>) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: updates.status,
        cancel_at_period_end: !updates.autoRenew,
        metadata: {
          amount: updates.amount
        }
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(id: string) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'inactive',
        cancel_at_period_end: true
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function getSubscriptionStats() {
  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*');

    if (error) throw error;

    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const totalRevenue = activeSubscriptions.reduce((sum, sub) => sum + (sub.metadata?.amount || 0), 0);

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      totalRevenue,
      averageRevenue: totalRevenue / (activeSubscriptions.length || 1)
    };
  } catch (error) {
    console.error('Error fetching subscription stats:', error);
    throw error;
  }
}