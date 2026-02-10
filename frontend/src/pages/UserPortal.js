import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode.react';

export default function UserPortal() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('user_data');
    if (!data) {
      navigate('/user/login');
      return;
    }
    setUserData(JSON.parse(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    navigate('/user/login');
  };

  if (!userData) return null;

  const user = userData.data;
  const isStudent = userData.role === 'student';

  return (
    <div className="min-h-screen bg-slate-50" data-testid="user-portal">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PICT Guard</h1>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            data-testid="user-logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        {/* ID Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden" data-testid="id-card">
          {/* Card Header */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight">PICT Guard</h2>
                <p className="text-slate-300 text-sm">{isStudent ? 'Student' : 'Faculty'} Gate Pass</p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {/* Profile Info */}
            <div className="mb-8">
              {isStudent && (
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Registration Number</p>
              )}
              {!isStudent && (
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Faculty ID</p>
              )}
              <p className="text-2xl font-bold text-slate-900 font-mono mb-4" data-testid="user-id">
                {isStudent ? user.reg_no : user.faculty_id}
              </p>
              
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Name</p>
              <p className="text-xl font-semibold text-slate-900 mb-4" data-testid="user-name">{user.name}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-slate-700" data-testid="user-email">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Mobile</p>
                  <p className="text-sm text-slate-700" data-testid="user-mobile">{user.mobile_no}</p>
                </div>
              </div>

              {!isStudent && (
                <div className="mt-4">
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-sm text-slate-700">{user.department}</p>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg border border-slate-200" data-testid="qr-code-container">
                <QRCode value={user.token} size={200} level="H" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Valid Until</p>
                <p className="text-lg font-semibold text-slate-900 font-mono" data-testid="valid-till">
                  {new Date(user.valid_till).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-sm text-sky-900">
                <strong>Instructions:</strong> Show this QR code to the guard at the gate for entry. 
                Ensure the code is clearly visible and not expired.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}