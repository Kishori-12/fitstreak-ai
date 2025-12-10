import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../styles/theme';
import toast from 'react-hot-toast';
import { playSound } from '../utils/soundEffects';

const Login = () => {
  const { signInWithGoogle, signInWithEmail, registerWithEmail, resetPassword, logout } = useAuth();
  const [loginMode, setLoginMode] = useState('login'); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      try { playSound('toast'); } catch {}
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const result = await signInWithEmail(formData.email, formData.password);
    
    if (result.success) {
      try { playSound('toast'); } catch {}
      toast.success('Login successful!');
      // Clear form after successful login
      setFormData({ email: '', password: '', confirmPassword: '', rememberMe: false });
    } else {
      // Clean up error messages - remove technical terms
      let errorMessage = result.error || 'Login failed';
      if (errorMessage.includes('auth/')) {
        if (errorMessage.includes('invalid-credential') || errorMessage.includes('user-not-found') || errorMessage.includes('wrong-password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (errorMessage.includes('too-many-requests')) {
          errorMessage = 'Too many failed attempts. Please try again later.';
        } else {
          errorMessage = 'Login failed. Please try again.';
        }
      }
      try { playSound('toast'); } catch {}
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.username) {
      try { playSound('toast'); } catch {}
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      try { playSound('toast'); } catch {}
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      try { playSound('toast'); } catch {}
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    const result = await registerWithEmail(formData.email, formData.password, formData.username);
    
    if (result.success) {
      try { playSound('toast'); } catch {}
      toast.success('Account created successfully! Please sign in with your credentials.');
      // Clear form and switch to login
      setFormData({ email: '', password: '', confirmPassword: '', username: '', rememberMe: false });
      setLoginMode('login');
      // Sign out the user immediately after registration
      await logout();
    } else {
      // Clean up error messages
      let errorMessage = result.error || 'Registration failed';
      if (errorMessage.includes('auth/')) {
        if (errorMessage.includes('email-already-in-use')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (errorMessage.includes('weak-password')) {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (errorMessage.includes('invalid-email')) {
          errorMessage = 'Please enter a valid email address.';
        } else {
          errorMessage = 'Registration failed. Please try again.';
        }
      }
      try { playSound('toast'); } catch {}
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      try { playSound('toast'); } catch {}
      toast.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(formData.email);
    
    if (result.success) {
      try { playSound('toast'); } catch {}
      toast.success('Password reset email sent! Check your inbox.');
      // Clear form and switch to login
      setFormData({ email: '', password: '', confirmPassword: '', username: '', rememberMe: false });
      setLoginMode('login');
    } else {
      try { playSound('toast'); } catch {}
      const errorMsg = result.error || 'Failed to send reset email';
      // Provide user-friendly error messages for common Firebase errors
      let displayError = errorMsg;
      if (errorMsg.includes('auth/user-not-found')) {
        displayError = 'No account found with this email address.';
      } else if (errorMsg.includes('auth/invalid-email')) {
        displayError = 'Please enter a valid email address.';
      }
      toast.error(displayError);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: `2px solid ${theme.colors.neutral[200]}`,
    fontSize: '16px',
    transition: 'all 0.2s ease',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.9)'
  };

  const buttonStyle = {
    width: '100%',
    background: theme.colors.primary.gradient,
    color: '#FFFFFF',
    fontWeight: '600',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid #7DD3FC',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    boxShadow: theme.shadows.md,
    opacity: loading ? 0.7 : 1
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.colors.background.main,
      padding: '24px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: theme.colors.background.card,
          backdropFilter: 'blur(10px)',
          borderRadius: '25px',
          padding: '40px',
          boxShadow: theme.shadows.glass,
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          border: `1px solid ${theme.colors.neutral[200]}`
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🐱✨</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: theme.colors.text.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>FitStreak AI</h1>
          <p style={{
            color: theme.colors.text.secondary,
            fontSize: '16px',
            lineHeight: '1.5'
          }}>Your personalized habit coach with a virtual pet!</p>
        </div>

        {/* Login Form */}
        {loginMode === 'login' && (
          <form onSubmit={handleEmailLogin} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary.main}
                onBlur={(e) => e.target.style.borderColor = theme.colors.neutral[200]}
              />
            </div>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary.main}
                onBlur={(e) => e.target.style.borderColor = theme.colors.neutral[200]}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: theme.colors.text.primary }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  style={{ accentColor: '#0EA5E9' }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setLoginMode('forgot')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.accent.main,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: '500'
                }}
              >
                Forgot password?
              </button>
            </div>
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {loginMode === 'register' && (
          <form onSubmit={handleRegister} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary.main}
                onBlur={(e) => e.target.style.borderColor = theme.colors.neutral[200]}
              />
            </div>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary.main}
                onBlur={(e) => e.target.style.borderColor = theme.colors.neutral[200]}
              />
            </div>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary.main}
                onBlur={(e) => e.target.style.borderColor = theme.colors.neutral[200]}
              />
            </div>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary.main}
                onBlur={(e) => e.target.style.borderColor = theme.colors.neutral[200]}
              />
            </div>
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {loginMode === 'forgot' && (
          <form onSubmit={handleForgotPassword} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary.main}
                onBlur={(e) => e.target.style.borderColor = theme.colors.neutral[200]}
              />
            </div>
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Mode Switcher */}
        <div style={{ marginBottom: '20px', fontSize: '14px', color: theme.colors.text.primary }}>
          {loginMode === 'login' && (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setLoginMode('register');
                  setFormData({ email: '', password: '', confirmPassword: '', username: '', rememberMe: false });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0EA5E9',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Sign up
              </button>
            </span>
          )}
          {loginMode === 'register' && (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setLoginMode('login');
                  setFormData({ email: '', password: '', confirmPassword: '', username: '', rememberMe: false });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0EA5E9',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Sign in
              </button>
            </span>
          )}
          {loginMode === 'forgot' && (
            <span>
              Remember your password?{' '}
              <button
                onClick={() => {
                  setLoginMode('login');
                  setFormData({ email: '', password: '', confirmPassword: '', username: '', rememberMe: false });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0EA5E9',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0',
          color: theme.colors.text.primary,
          fontSize: '14px'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#BAE6FD' }}></div>
          <span style={{ padding: '0 16px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#BAE6FD' }}></div>
        </div>

        {/* Google Login */}
        <button
          onClick={async () => {
            const result = await signInWithGoogle();
            if (result.success) {
              window.location.reload();
            }
          }}
          style={{
            width: '100%',
            background: theme.colors.background.card,
            color: theme.colors.text.primary,
            fontWeight: '600',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '2px solid #BAE6FD',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
            boxShadow: theme.shadows.md
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}
        >
          <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div style={{
          marginTop: '25px',
          fontSize: '14px',
          color: theme.colors.text.secondary,
          lineHeight: '1.4',
          fontWeight: '500'
        }}>
          Track your daily habits and watch your virtual pet grow! 🌱
        </div>
      </motion.div>
    </div>
  );
};

export default Login;