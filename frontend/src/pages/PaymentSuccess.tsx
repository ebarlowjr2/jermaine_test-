import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { paymentApi } from '../services/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        const result = await paymentApi.verifyPayment(sessionId);
        if (result.enrolled) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-16 h-16 text-[#1877F2] mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Issue</h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again or contact support.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/courses')}
                className="w-full bg-[#1877F2] hover:bg-[#1664d9]"
              >
                Browse Courses
              </Button>
              <Link to="/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! You now have access to the course.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-[#1877F2] hover:bg-[#1664d9]"
            >
              Go to My Courses
            </Button>
            <Link to="/courses">
              <Button variant="outline" className="w-full">
                Browse More Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
