import { Component } from 'react';
import { theme } from '../styles/theme';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.colors.background.main,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>😿</div>
            <h2 style={{ color: theme.colors.primary.main, marginBottom: '10px' }}>
              Oops! Something went wrong
            </h2>
            <p style={{ color: theme.colors.neutral[600], marginBottom: '20px' }}>
              Don't worry, your pet is safe! Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: theme.colors.primary.gradient,
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;