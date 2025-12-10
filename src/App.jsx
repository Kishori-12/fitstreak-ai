import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const queryClient = new QueryClient();

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)'
      }}>
        <div style={{ color: '#667eea', fontSize: '20px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {user ? <Dashboard /> : <Login />}
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;