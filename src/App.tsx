import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages (to be created)
import Home from './pages/Home';
import Feed from './pages/Feed';
import Leadership from './pages/Leadership';
import Members from './pages/Members';
import Payments from './pages/Payments';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/auth" />;
  
  if (role && profile?.role !== role && profile?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/members" element={<Members />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute role="moderator">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
