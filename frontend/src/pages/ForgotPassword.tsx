import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { authApi } from '../services/api';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1877F2] to-[#0d4ea6] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#1877F2] font-bold text-2xl">V</span>
            </div>
            <span className="text-2xl font-bold text-white">Virtual IT Labs</span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                <p className="text-gray-600 mb-6">
                  If an account exists with {email}, we've sent password reset instructions.
                </p>
                <Link to="/login">
                  <Button className="bg-[#1877F2] hover:bg-[#1664d9]">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 text-center mb-8">
                  Enter your email and we'll send you reset instructions
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#1877F2] hover:bg-[#1664d9]"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-[#1877F2] font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
