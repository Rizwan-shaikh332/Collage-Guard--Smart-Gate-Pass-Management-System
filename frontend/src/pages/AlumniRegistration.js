import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function AlumniRegistration() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [step, setStep] = useState('form'); // 'form', 'camera', 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    college_department: '',
    purpose: '',
    current_company: '',
    job_position: '',
    specialization: '',
    ctc_monthly: '',
    other_details: '',
  });
  const [photoBase64, setPhotoBase64] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const capture = useCallback(() => {
    // Countdown
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        const imageSrc = webcamRef.current.getScreenshot();
        setPhotoBase64(imageSrc);
        setStep('form');
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [webcamRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/alumni`, {
        ...formData,
        photo_base64: photoBase64,
      });

      setRegistrationData(response.data);
      setStep('success');
      toast.success('Registration successful! QR code sent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="alumni-registration">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alumni Registration</h1>
          </div>
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            data-testid="back-to-home"
          >
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Form Step */}
        {step === 'form' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Register as Alumni</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="mt-2 h-10"
                    data-testid="alumni-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="mt-2 h-10"
                    data-testid="alumni-email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="text"
                    placeholder="Enter your mobile number"
                    value={formData.mobile_no}
                    onChange={(e) => setFormData({...formData, mobile_no: e.target.value})}
                    required
                    className="mt-2 h-10"
                    data-testid="alumni-mobile"
                  />
                </div>

                <div>
                  <Label htmlFor="department">College / Department *</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Your department"
                    value={formData.college_department}
                    onChange={(e) => setFormData({...formData, college_department: e.target.value})}
                    required
                    className="mt-2 h-10"
                    data-testid="alumni-department"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Input
                  id="purpose"
                  type="text"
                  placeholder="Brief description of your visit"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  required
                  className="mt-2 h-10"
                  data-testid="alumni-purpose"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company">Current Company *</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your current company"
                    value={formData.current_company}
                    onChange={(e) => setFormData({...formData, current_company: e.target.value})}
                    required
                    className="mt-2 h-10"
                    data-testid="alumni-company"
                  />
                </div>

                <div>
                  <Label htmlFor="position">Job Position *</Label>
                  <Input
                    id="position"
                    type="text"
                    placeholder="Your job position"
                    value={formData.job_position}
                    onChange={(e) => setFormData({...formData, job_position: e.target.value})}
                    required
                    className="mt-2 h-10"
                    data-testid="alumni-position"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    type="text"
                    placeholder="Your specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    required
                    className="mt-2 h-10"
                    data-testid="alumni-specialization"
                  />
                </div>

                <div>
                  <Label htmlFor="ctc">CTC (Monthly) *</Label>
                  <Input
                    id="ctc"
                    type="text"
                    placeholder="Your monthly CTC"
                    value={formData.ctc_monthly}
                    onChange={(e) => setFormData({...formData, ctc_monthly: e.target.value})}
                    required
                    className="mt-2 h-10"
                    data-testid="alumni-ctc"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="other">Other Details</Label>
                <Input
                  id="other"
                  type="text"
                  placeholder="Any other details (optional)"
                  value={formData.other_details}
                  onChange={(e) => setFormData({...formData, other_details: e.target.value})}
                  className="mt-2 h-10"
                  data-testid="alumni-other"
                />
              </div>

              {/* Photo Capture */}
              <div>
                <Label>Photo (Selfie) *</Label>
                <div className="mt-2">
                  {!photoBase64 ? (
                    <Button
                      type="button"
                      onClick={() => setStep('camera')}
                      variant="secondary"
                      className="w-full h-12"
                      data-testid="capture-photo-btn"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Photo
                    </Button>
                  ) : (
                    <div>
                      <img src={photoBase64} alt="Captured" className="w-full rounded-lg mb-2" />
                      <Button
                        type="button"
                        onClick={() => setStep('camera')}
                        variant="secondary"
                        className="w-full"
                        data-testid="retake-photo-btn"
                      >
                        Retake Photo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12"
                disabled={loading || !photoBase64}
                data-testid="submit-alumni"
              >
                {loading ? 'Registering...' : 'Register & Get QR Code'}
              </Button>
            </form>
          </div>
        )}

        {/* Camera Step */}
        {step === 'camera' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight text-center">Take a Selfie</h2>
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg qr-scanner-video"
                mirrored
                data-testid="webcam"
              />
              {countdown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <span className="text-9xl font-bold text-white">{countdown}</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-dashed border-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => setStep('form')}
                variant="secondary"
                className="flex-1"
                data-testid="cancel-camera"
              >
                Cancel
              </Button>
              <Button
                onClick={capture}
                className="flex-1 bg-slate-900 hover:bg-slate-800"
                disabled={countdown !== null}
                data-testid="capture-btn"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && registrationData && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 text-center" data-testid="registration-success">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Registration Successful!</h2>
            <p className="text-slate-600 mb-8">Your gate pass has been generated and sent to your email.</p>

            <div className="bg-white p-6 rounded-lg border border-slate-200 inline-block mb-6" data-testid="alumni-qr">
              <QRCodeSVG value={registrationData.token} size={200} level="H" />
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Valid Until</p>
              <p className="text-xl font-semibold text-slate-900 font-mono" data-testid="alumni-valid-till">
                {new Date(registrationData.valid_till).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200 mb-6">
              <p className="text-sm text-sky-900">
                Please check your email for the QR code. You can also screenshot this page.
                This pass is valid for 24 hours only.
              </p>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="bg-slate-900 hover:bg-slate-800"
              data-testid="back-home"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}