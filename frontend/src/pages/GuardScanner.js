import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, LogOut, ScanLine, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function GuardScanner() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guardData, setGuardData] = useState(null);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState(0);
  const inputRef = useRef(null);

  // Auto-refresh countdown effect
  useEffect(() => {
    if (autoRefreshCountdown <= 0) return;
    
    const timer = setTimeout(() => {
      setAutoRefreshCountdown(autoRefreshCountdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [autoRefreshCountdown]);

  useEffect(() => {
    const data = localStorage.getItem('guard_data');
    if (!data) {
      navigate('/guard/login');
      return;
    }
    setGuardData(JSON.parse(data));
  }, []);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setValidationResult(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/validate-qr`, {
        token: token.trim(),
      });

      setValidationResult(response.data);
      
      // Auto clear after 5 seconds for both valid and invalid
      setAutoRefreshCountdown(5);
      setTimeout(() => {
        setValidationResult(null);
        setToken('');
        setAutoRefreshCountdown(0);
        inputRef.current?.focus();
      }, 5000);
    } catch (error) {
      console.error('Validation error:', error);
      const errorMessage = error.response?.data?.detail || 'Token not found';
      setValidationResult({ valid: false, reason: errorMessage });
      
      // Auto refresh on error as well
      setAutoRefreshCountdown(5);
      setTimeout(() => {
        setValidationResult(null);
        setToken('');
        setAutoRefreshCountdown(0);
        inputRef.current?.focus();
      }, 5000);
      
      toast.error('Failed to validate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    setValidationResult(null);
    setToken('');
    setAutoRefreshCountdown(0);
    inputRef.current?.focus();
  };

  const handleLogout = () => {
    localStorage.removeItem('guard_data');
    navigate('/guard/login');
  };

  if (!guardData) return null;

  return (
    <div className="min-h-screen" data-testid="guard-scanner">
      {/* Normal View */}
      {!validationResult && (
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <header className="bg-white border-b border-slate-200">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ScanLine className="w-8 h-8 text-slate-900" />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Guard Scanner</h1>
                  <p className="text-sm text-slate-500">Logged in as {guardData.guard_id}</p>
                </div>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="ghost"
                className="text-slate-600 hover:text-slate-900"
                data-testid="guard-logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>

          <div className="container mx-auto px-6 py-12 max-w-2xl">
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ScanLine className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Scan QR Code</h2>
                <p className="text-slate-600">Enter or scan the token to validate entry</p>
              </div>

              <form onSubmit={handleValidate} className="space-y-6">
                <div>
                  <Label htmlFor="token">QR Code Token</Label>
                  <Input
                    ref={inputRef}
                    id="token"
                    type="text"
                    placeholder="Scan or enter token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    className="mt-2 h-14 text-lg font-mono"
                    autoFocus
                    data-testid="qr-token-input"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-lg"
                  disabled={loading}
                  data-testid="validate-qr-btn"
                >
                  {loading ? 'Validating...' : 'Validate QR Code'}
                </Button>
              </form>

              <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <p className="text-sm text-sky-900">
                  <strong>Instructions:</strong> Scan the QR code using a scanner or manually enter the token. 
                  The system will instantly verify if the pass is valid.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Result - Traffic Light Effect */}
      {validationResult && (
        <div 
          className={`min-h-screen flex items-center justify-center p-8 transition-all duration-500 ${
            validationResult.valid 
              ? 'bg-emerald-500 traffic-light-valid' 
              : 'bg-red-500 traffic-light-invalid'
          }`}
          data-testid={validationResult.valid ? 'validation-valid' : 'validation-invalid'}
        >
          <div className="text-center text-white">
            {validationResult.valid ? (
              <>
                <CheckCircle className="w-32 h-32 mx-auto mb-8 animate-bounce" />
                <h2 className="text-6xl font-bold mb-4 tracking-tight">✓ ACCESS GRANTED</h2>
                <p className="text-3xl mb-8">{validationResult.name}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto mb-8">
                  <p className="text-xl mb-2">🏷️ Type: {validationResult.type}</p>
                  <p className="text-xl mb-2">📧 Email: {validationResult.email}</p>
                  <p className="text-xl">📅 Valid Until: {new Date(validationResult.valid_till).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleManualRefresh}
                    className="bg-white text-emerald-600 hover:bg-slate-100 font-semibold px-6 py-2"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Now
                  </Button>
                </div>
                <p className="text-lg mt-6 opacity-75">⏱️ Auto-refreshing in {autoRefreshCountdown} seconds...</p>
              </>
            ) : (
              <>
                <XCircle className="w-32 h-32 mx-auto mb-8 animate-bounce" />
                <h2 className="text-6xl font-bold mb-4 tracking-tight">✗ ACCESS DENIED</h2>
                <p className="text-3xl mb-8 font-semibold">{validationResult.reason}</p>
                {validationResult.name && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto mb-8">
                    <p className="text-xl mb-2">👤 Name: {validationResult.name}</p>
                    {validationResult.expired_on && (
                      <p className="text-xl">📅 Expired On: {new Date(validationResult.expired_on).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleManualRefresh}
                    className="bg-white text-red-600 hover:bg-slate-100 font-semibold px-6 py-2"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
                <p className="text-lg mt-6 opacity-75">⏱️ Auto-refreshing in {autoRefreshCountdown} seconds...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}