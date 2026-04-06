import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { token } = await adminAPI.login(email, password);
      
      // Store tokens and update global auth state
      await login(token);
      
      // Navigate to dashboard after state is updated
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      if (err.response?.status === 401) {
        setError('Unauthorized access. Only administrators can enter here.');
      } else if (err.response?.status === 403) {
        setError('Invalid credentials. Please verify your email and password.');
      } else if (err.message === 'Network Error') {
        setError('Server is offline. Please ensure the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden" style={{ backgroundColor: 'var(--color-text-primary)', minHeight: '100vh' }}>
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(79, 70, 229, 0.2)' }}></div>

      {/* Back to Store Link */}
      <Link 
        to="/" 
        className="admin-login-back-link"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(255,255,255,0.7)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'color 0.2s',
          zIndex: 20,
        }}
        onMouseEnter={(e) => e.target.style.color = 'rgba(255,255,255,1)'}
        onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
      >
        <ArrowLeft size={18} /> Back to Store
      </Link>

      <div className="w-full max-w-md px-6 z-10" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-2xl mb-6 p-4" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.3)' }}>
              <ShieldCheck size={40} className="text-white" />
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--color-text-inverse)' }}>Admin Portal</h1>
           <p className="font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Please enter your credentials to continue</p>
        </div>

        <div className="backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(30, 41, 59, 0.8)', animation: 'fadeInUp 0.7s ease-out 0.2s both' }}>
          {error && (
            <div className="p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in shake duration-300" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--color-danger)' }}>
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="form-group">
              <label className="input-label" style={{ color: 'var(--color-text-tertiary)' }}>Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors" style={{ color: 'var(--color-text-tertiary)' }}>
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="input-field pl-11 py-4"
                  style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(51, 65, 85, 0.8)', color: 'var(--color-text-inverse)' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label" style={{ color: 'var(--color-text-tertiary)' }}>Secret Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors" style={{ color: 'var(--color-text-tertiary)' }}>
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  className="input-field pl-11 py-4"
                  style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(51, 65, 85, 0.8)', color: 'var(--color-text-inverse)' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full btn-lg mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-12" style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-text-inverse)' }}>
            TecMart Admin Portal
          </p>
          <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            Authorized personnel only. All access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
