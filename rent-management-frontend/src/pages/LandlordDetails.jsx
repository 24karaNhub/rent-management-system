import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLandlordById, getPropertiesByLandlord, getTenantsByLandlord } from '../service/LandlordService'

function LandlordDetails() {
  const { id } = useParams()

  const [landlord, setLandlord] = useState(null)
  const [properties, setProperties] = useState([])
  const [tenants, setTenants] = useState([])

 useEffect(() => {
  getLandlordById(id)
    .then(res => {
      console.log("LANDLORD:", res.data)
      setLandlord(res.data)
    })
    .catch(err => console.error("LANDLORD ERROR:", err))

  getPropertiesByLandlord(id)
    .then(res => {
      console.log("PROPERTIES:", res.data)
      setProperties(Array.isArray(res.data) ? res.data : [])
    })
    .catch(err => {
      console.error("PROPERTIES ERROR:", err)
      setProperties([])
    })

  getTenantsByLandlord(id)
    .then(res => {
      console.log("TENANTS:", res.data)
      setTenants(Array.isArray(res.data) ? res.data : [])
    })
    .catch(err => {
      console.error("TENANTS ERROR:", err)
      setTenants([])
    })

}, [id])

  return (
  <div style={{ color: 'white', padding: '30px' }}>
    
    <h1>Landlord Details</h1>

    {/* LANDLORD */}
    {landlord ? (
      <div>
        <h2>{landlord.name}</h2>
        <p>{landlord.email}</p>
        <p>{landlord.phone}</p>
      </div>
    ) : (
      <p>Loading landlord...</p>
    )}

    {/* PROPERTIES */}
    <h2>Properties</h2>
    {properties.length === 0 ? (
      <p>No properties found</p>
    ) : (
      properties.map(p => (
        <div key={p.id}>
          <p>{p.name}</p>
        </div>
      ))
    )}

    {/* TENANTS */}
    <h2>Tenants</h2>
    {tenants.length === 0 ? (
      <p>No tenants found</p>
    ) : (
      tenants.map(t => (
        <div key={t.id}>
          <p>{t.name}</p>
          <p>{t.propertyAddress}</p>
        </div>
      ))
    )}

  </div>
)}
export default LandlordDetails;