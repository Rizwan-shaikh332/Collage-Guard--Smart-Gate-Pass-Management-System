import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/user/login`, {
        email,
        mobile_no: mobileNo,
      });

      if (response.data.success) {
        localStorage.setItem('user_data', JSON.stringify(response.data));
        toast.success('Login successful!');
        navigate('/user/portal');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8" data-testid="user-login-form">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-2 tracking-tight">Student / Faculty Portal</h2>
          <p className="text-slate-600 text-center mb-8">Sign in to view your gate pass</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 h-10"
                data-testid="user-email-input"
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="text"
                placeholder="Enter your mobile number"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                required
                className="mt-2 h-10"
                data-testid="user-mobile-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10"
              disabled={loading}
              data-testid="user-login-submit"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-900"
              data-testid="back-to-home"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}