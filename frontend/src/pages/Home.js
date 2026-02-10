import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Calendar, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">PICT Guard</h1>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/admin/login')} 
              variant="ghost" 
              className="text-white hover:text-sky-400 hover:bg-white/10"
              data-testid="admin-login-nav"
            >
              Admin Login
            </Button>
            <Button 
              onClick={() => navigate('/user/login')} 
              variant="ghost" 
              className="text-white hover:text-sky-400 hover:bg-white/10"
              data-testid="user-login-nav"
            >
              Student/Faculty Login
            </Button>
            <Button 
              onClick={() => navigate('/guard/login')} 
              variant="ghost" 
              className="text-white hover:text-sky-400 hover:bg-white/10"
              data-testid="guard-login-nav"
            >
              Guard Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Smart Gate Pass Management
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Secure, efficient, and paperless gate pass system for your campus. 
            Generate QR codes, track entries, and manage access seamlessly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/visitor/register')} 
              size="lg"
              className="bg-sky-500 hover:bg-sky-600 text-white shadow-lg h-12 px-8"
              data-testid="visitor-register-btn"
            >
              Visitor Registration
            </Button>
            <Button 
              onClick={() => navigate('/alumni/register')} 
              size="lg"
              variant="secondary"
              className="bg-white hover:bg-slate-100 text-slate-900 h-12 px-8"
              data-testid="alumni-register-btn"
            >
              Alumni Registration
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="feature-qr">
            <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center mb-4">
              <ScanLine className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">QR Code Based</h3>
            <p className="text-slate-600">Instant QR code generation for quick and secure entry validation</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="feature-users">
            <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Multi-User Support</h3>
            <p className="text-slate-600">Students, faculty, visitors, and alumni - all in one platform</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="feature-events">
            <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Event Management</h3>
            <p className="text-slate-600">Create events and issue time-bound passes effortlessly</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="feature-security">
            <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure & Reliable</h3>
            <p className="text-slate-600">Validity checks ensure only authorized personnel can enter</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-slate-400">
            © 2026 PICT Guard - Smart Gate Pass Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}