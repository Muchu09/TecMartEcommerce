import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#d9534f' }}>Oops! Something went wrong.</h1>
          <p>We're sorry for the inconvenience. Our team has been notified.</p>
          <button 
            style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}
            onClick={() => window.location.href = '/'}
          >
            Go back to Home
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
