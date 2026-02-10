import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function GuardLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/guard/login`, {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('guard_data', JSON.stringify(response.data));
        toast.success('Login successful!');
        navigate('/guard/scanner');
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
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8" data-testid="guard-login-form">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center">
              <ScanLine className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-2 tracking-tight">Guard Portal</h2>
          <p className="text-slate-600 text-center mb-8">Sign in to scan QR codes</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username (e.g., guard1)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 h-10"
                data-testid="guard-username-input"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 h-10"
                data-testid="guard-password-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10"
              disabled={loading}
              data-testid="guard-login-submit"
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

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 text-center">Demo Credentials</p>
            <p className="text-sm text-slate-700 text-center font-mono mt-1">
              guard1 / guard123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}