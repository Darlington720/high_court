import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { X, CreditCard, Phone, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: number;
    duration: string;
  };
}

// Initialize Stripe with your actual publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState<'mtn' | 'airtel' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStripePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Please sign in to continue');

      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan.name,
          price: plan.price,
          userId: user.id
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // Use Stripe Elements or collect card details securely
          },
          billing_details: {
            email: user.email
          }
        }
      });

      if (stripeError) throw stripeError;

      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: user.id,
          plan: plan.name.toLowerCase(),
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + getDurationInMs(plan.duration)).toISOString(),
          amount: plan.price,
          currency: 'USD',
          auto_renew: true,
          metadata: {
            payment_method: 'card',
            stripe_payment_intent: clientSecret
          }
        }]);

      if (subscriptionError) throw subscriptionError;

      // Update user's subscription tier
      const { error: updateError } = await supabase
        .from('users')
        .update({ subscription_tier: plan.name.toLowerCase() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onClose();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileMoneyPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!mobileNumber || !mobileProvider) {
        throw new Error('Please provide mobile number and select provider');
      }

      // Validate mobile number format
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobileNumber)) {
        throw new Error('Please enter a valid 10-digit mobile number');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Please sign in to continue');

      // Initialize mobile money payment
      const response = await fetch('/api/mobile-money/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: mobileProvider,
          phoneNumber: mobileNumber,
          amount: plan.price,
          userId: user.id,
          plan: plan.name
        }),
      });

      const { transactionId, status } = await response.json();
      if (status !== 'pending') throw new Error('Failed to initiate mobile money payment');

      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: user.id,
          plan: plan.name.toLowerCase(),
          status: 'pending',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + getDurationInMs(plan.duration)).toISOString(),
          amount: plan.price,
          currency: 'USD',
          auto_renew: true,
          metadata: {
            payment_method: 'mobile_money',
            provider: mobileProvider,
            phone_number: mobileNumber,
            transaction_id: transactionId
          }
        }]);

      if (subscriptionError) throw subscriptionError;

      // Show success message and close modal
      onClose();
    } catch (err) {
      console.error('Mobile money error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDurationInMs = (duration: string): number => {
    switch (duration.toLowerCase()) {
      case '1 day':
        return 24 * 60 * 60 * 1000;
      case 'per year':
        return 365 * 24 * 60 * 60 * 1000;
      default:
        return 30 * 24 * 60 * 60 * 1000; // Default to 30 days
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Subscribe to {plan.name}
                  </h3>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="space-y-4">
                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Button
                        variant={paymentMethod === 'card' ? 'primary' : 'outline'}
                        onClick={() => setPaymentMethod('card')}
                        className="flex items-center justify-center"
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Card
                      </Button>
                      <Button
                        variant={paymentMethod === 'mobile' ? 'primary' : 'outline'}
                        onClick={() => setPaymentMethod('mobile')}
                        className="flex items-center justify-center"
                      >
                        <Phone className="mr-2 h-5 w-5" />
                        Mobile Money
                      </Button>
                    </div>

                    {/* Payment Forms */}
                    {paymentMethod === 'card' && (
                      <Button
                        variant="primary"
                        onClick={handleStripePayment}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? 'Processing...' : 'Pay with Card'}
                      </Button>
                    )}

                    {paymentMethod === 'mobile' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Provider
                          </label>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <Button
                              variant={mobileProvider === 'mtn' ? 'primary' : 'outline'}
                              onClick={() => setMobileProvider('mtn')}
                            >
                              MTN Mobile Money
                            </Button>
                            <Button
                              variant={mobileProvider === 'airtel' ? 'primary' : 'outline'}
                              onClick={() => setMobileProvider('airtel')}
                            >
                              Airtel Money
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          onClick={handleMobileMoneyPayment}
                          disabled={loading || !mobileNumber || !mobileProvider}
                          className="w-full"
                        >
                          {loading ? 'Processing...' : 'Pay with Mobile Money'}
                        </Button>
                      </div>
                    )}

                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              Payment Error
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                              {error}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}