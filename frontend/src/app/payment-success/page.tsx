'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { paymentApi } from '@/services/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setMessage('Invalid payment session');
        return;
      }

      try {
        const result = await paymentApi.verifyPayment(sessionId);
        if (result.enrolled) {
          setStatus('success');
          setMessage('Your payment was successful and you are now enrolled in the course!');
        } else {
          setStatus('error');
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch {
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-[#1877F2] mx-auto animate-spin" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Verifying Payment...</h1>
            <p className="mt-2 text-gray-600">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <div className="mt-6 space-y-3">
              <Link href="/dashboard">
                <Button className="w-full">Go to My Courses</Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" className="w-full">Browse More Courses</Button>
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Issue</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <div className="mt-6 space-y-3">
              <Link href="/contact">
                <Button className="w-full">Contact Support</Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#1877F2] animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
