import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import LandlordDetails from './pages/LandlordDetails';
import Landlords from './pages/Landlords';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthPage from './pages/AuthPage';

// A simple wrapper to ensure layout isn't applied to auth pages
function ProtectedApp() {
  const user = localStorage.getItem('user');

  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Routes>
        <Route path="/"              element={<Dashboard />} />
        <Route path="/properties"    element={<Properties />} />
        <Route path="/tenants"       element={<Tenants />} />
        <Route path="/payments"      element={<Payments />} />
        <Route path="/landlords"     element={<Landlords />} />
        <Route path="/landlords/:id" element={<LandlordDetails />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes don't inherit Dashboard Layout */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        
        {/* All other routes get the Dashboard layout */}
        <Route path="/*" element={<ProtectedApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;