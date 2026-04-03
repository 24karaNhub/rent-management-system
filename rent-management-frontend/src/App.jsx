import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import LandlordDetails from './pages/LandlordDetails';
import Landlords from './pages/Landlords';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
export default App;