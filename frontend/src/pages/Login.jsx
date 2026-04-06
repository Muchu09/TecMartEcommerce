import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      login(response.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)' }}>
  
      <div className="card w-full max-w-md">
  
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Welcome Back 👋
        </h2>
        <p className="text-center mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Login to your TecMart account
        </p>
  
        {error && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}>
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-5">
  
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
                placeholder="Enter your password"
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
  
          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
              <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} />
              Remember me
            </label>
            <a href="#" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
              Forgot password?
            </a>
          </div>
  
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full btn-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
  
        {/* Register Link */}
        <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium cursor-pointer hover:underline" style={{ color: 'var(--color-primary)' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
