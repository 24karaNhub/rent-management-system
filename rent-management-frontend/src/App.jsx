import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import Landlords from './pages/Landlords'
import Properties from './pages/Properties'
import Tenants from './pages/Tenants'
import Payments from './pages/Payments'
import LandlordDetails from './pages/LandlordDetails'

<Route path="/landlords/:id" element={<LandlordDetails />} />
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/landlords" element={<Landlords />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/landlords/:id" element={<LandlordDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App