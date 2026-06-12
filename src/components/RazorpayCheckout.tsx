import React, { useState } from 'react';
import { api } from '../services/api';
import { IndianRupee, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface RazorpayCheckoutProps {
  /** Amount in rupees (will be converted to paise internally) */
  amountInRupees: number;
  /** Short label shown on the button, e.g. "Pay ₹320" */
  label?: string;
  /** Receipt identifier for the order, e.g. a bill ID or "fees-q3-2024" */
  receipt?: string;
  /** Pre-fill user details in the Razorpay modal */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Called with true when payment is verified, false on failure */
  onResult?: (success: boolean, message: string) => void;
  className?: string;
}

type PayState = 'idle' | 'creating' | 'verifying' | 'success' | 'error';

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  amountInRupees,
  label,
  receipt = `receipt_${Date.now()}`,
  prefill,
  onResult,
  className = '',
}) => {
  const [payState, setPayState] = useState<PayState>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handlePay = async () => {
    if (payState !== 'idle' && payState !== 'error') return;

    setPayState('creating');
    setStatusMsg('');

    try {
      // Step 1 — fetch public key from backend (never from env directly, backend is source-of-truth)
      let keyId: string;
      try {
        const keyData = await api.getRazorpayKey();
        keyId = keyData.key_id;
      } catch {
        throw new Error('Payment gateway not configured. Please contact support.');
      }

      // Step 2 — create Razorpay order via backend
      const amountInPaise = Math.round(amountInRupees * 100);
      const order = await api.createOrder(amountInPaise, 'INR', receipt);

      // Step 3 — open Razorpay Standard Checkout modal
      await new Promise<void>((resolve, reject) => {
        if (!window.Razorpay) {
          reject(new Error('Razorpay checkout script not loaded. Check your internet connection.'));
          return;
        }

        const rzp = new window.Razorpay({
          key: keyId,
          amount: order.amount as number,
          currency: order.currency,
          name: 'TutorCRM',
          description: 'Tuition Fee Payment',
          order_id: order.order_id,
          prefill: prefill || {},
          theme: { color: '#6366f1' },
          handler: async (response) => {
            // Step 4 — verify signature server-side
            setPayState('verifying');
            try {
              const result = await api.verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (result.success) {
                setPayState('success');
                const msg = 'Payment successful! Your fee has been recorded.';
                setStatusMsg(msg);
                onResult?.(true, msg);
                resolve();
              } else {
                const msg = result.error || 'Payment verification failed. Contact support.';
                setPayState('error');
                setStatusMsg(msg);
                onResult?.(false, msg);
                reject(new Error(msg));
              }
            } catch (err: any) {
              const msg = err.message || 'Verification failed. Please contact support.';
              setPayState('error');
              setStatusMsg(msg);
              onResult?.(false, msg);
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              setPayState('idle');
              setStatusMsg('Payment cancelled.');
              resolve(); // resolve without error — user dismissed
            },
          },
        });

        // Listen for payment failures inside the modal
        rzp.on('payment.failed', (resp) => {
          const msg = resp.error?.description || 'Payment failed. Please try again.';
          setPayState('error');
          setStatusMsg(msg);
          onResult?.(false, msg);
          resolve();
        });

        rzp.open();
      });
    } catch (err: any) {
      const msg = err.message || 'Something went wrong. Please try again.';
      setPayState('error');
      setStatusMsg(msg);
      onResult?.(false, msg);
    }
  };

  const buttonLabel = label ?? `Pay ₹${amountInRupees.toLocaleString('en-IN')}`;

  return (
    <div className="w-full space-y-2">
      <button
        id="razorpay-checkout-btn"
        onClick={handlePay}
        disabled={payState === 'creating' || payState === 'verifying' || payState === 'success'}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer
          ${payState === 'success'
            ? 'bg-emerald-600 text-white cursor-default'
            : payState === 'error'
            ? 'bg-rose-600 hover:bg-rose-500 text-white'
            : 'bg-amber-600 hover:bg-amber-500 text-white'
          }
          disabled:opacity-60 disabled:cursor-not-allowed
          ${className}`}
      >
        {payState === 'creating' || payState === 'verifying' ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {payState === 'creating' ? 'Creating order…' : 'Verifying payment…'}
          </>
        ) : payState === 'success' ? (
          <>
            <CheckCircle className="h-3.5 w-3.5" />
            Payment Successful
          </>
        ) : payState === 'error' ? (
          <>
            <XCircle className="h-3.5 w-3.5" />
            Retry Payment
          </>
        ) : (
          <>
            <IndianRupee className="h-3.5 w-3.5" />
            {buttonLabel}
          </>
        )}
      </button>

      {statusMsg && (
        <p className={`text-[11px] text-center font-medium ${
          payState === 'success' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {statusMsg}
        </p>
      )}
    </div>
  );
};

export default RazorpayCheckout;
