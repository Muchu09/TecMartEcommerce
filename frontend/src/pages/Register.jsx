import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData.username, formData.email, formData.password);
      setSuccessMsg(response.message || 'Registration successful.');
      login(response.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-primary-light) 100%)' }}>
      
      <div className="card w-full max-w-md">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Create Account 🚀
        </h2>
        <p className="text-center mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Join TecMart and start sharing today
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success)', color: 'var(--color-success)' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div className="form-group">
            <label className="input-label">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3" style={{ color: 'var(--color-text-tertiary)' }} size={18} />
              <input
                type="text"
                name="username"
                placeholder="Enter your full name"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="input-label">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3" style={{ color: 'var(--color-text-tertiary)' }} size={18} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="input-label">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3" style={{ color: 'var(--color-text-tertiary)' }} size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="input-label">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3" style={{ color: 'var(--color-text-tertiary)' }} size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              style={{ accentColor: 'var(--color-accent)' }}
            />
            I agree to the Terms & Conditions
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full btn-lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Already have an account?{" "}
          <Link to="/login" className="font-medium cursor-pointer hover:underline" style={{ color: 'var(--color-accent)' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
