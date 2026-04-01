import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLandlordById, getPropertiesByLandlord, getTenantsByLandlord } from '../service/LandlordService'
 
function LandlordDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
 
  const [landlord, setLandlord] = useState(null)
  const [properties, setProperties] = useState([])
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    Promise.all([
      getLandlordById(id),
      getPropertiesByLandlord(id).catch(() => ({ data: [] })),
      getTenantsByLandlord(id).catch(() => ({ data: [] }))
    ]).then(([lRes, pRes, tRes]) => {
      setLandlord(lRes.data)
      setProperties(Array.isArray(pRes.data) ? pRes.data : [])
      setTenants(Array.isArray(tRes.data) ? tRes.data : [])
      setLoading(false)
    }).catch(err => {
      console.error("Error loading landlord details:", err)
      setLoading(false)
    })
  }, [id])
 
  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner} />
    </div>
  )
 
  if (!landlord) return (
    <div style={styles.center}>
      <p style={{ color: '#aaa' }}>Landlord not found.</p>
    </div>
  )
 
  return (
    <div style={styles.container}>
 
      {/* Back Button */}
      <button
        style={styles.backBtn}
        onClick={() => navigate('/landlords')}
        onMouseEnter={e => e.currentTarget.style.color = '#e94560'}
        onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
      >
        ← Back to Landlords
      </button>
 
      {/* Landlord Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileLeft}>
          <div style={styles.avatar}>{landlord.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1 style={styles.profileName}>{landlord.name}</h1>
            <span style={styles.idBadge}>ID: {landlord.id}</span>
          </div>
        </div>
        <div style={styles.profileRight}>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>📧</span>
            <span style={styles.contactText}>{landlord.email}</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>📱</span>
            <span style={styles.contactText}>{landlord.phone}</span>
          </div>
        </div>
      </div>
 
      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{properties.length}</span>
          <span style={styles.statLabel}>Properties</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{tenants.length}</span>
          <span style={styles.statLabel}>Tenants</span>
        </div>
      </div>
 
      {/* Properties Section */}
      <div style={styles.section}>
  <h2 style={styles.sectionTitle}>🏢 Properties</h2>

  {properties.length === 0 ? (
    <div style={styles.emptyCard}>
      <p style={styles.emptyText}>No properties found for this landlord.</p>
    </div>
  ) : (
    <div style={styles.grid}>
      {properties.map(p => (
        <div 
          key={p.id} 
          style={styles.card}

          // 🔥 Hover effect
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={styles.cardIcon}>🏢</div>

          <h3 style={styles.cardTitle}>
            {p.name || p.address || 'Property'}
          </h3>

          {p.address && (
            <p style={styles.cardInfo}>📍 {p.address}</p>
          )}

          {p.rent && (
            <p style={styles.cardInfoHighlight}>💰 ₹{p.rent}/month</p>
          )}

          <div style={styles.smallBadge}>ID: {p.id}</div>
        </div>
      ))}
    </div>
  )}
</div>
 
      {/* Tenants Section */}
      <div style={styles.section}>
  <h2 style={styles.sectionTitle}>👤 Tenants</h2>

  {tenants.length === 0 ? (
    <div style={styles.emptyCard}>
      <p style={styles.emptyText}>No tenants found for this landlord.</p>
    </div>
  ) : (
    <div style={styles.grid}>
      {tenants.map(t => (
        <div 
          key={t.id} 
          style={styles.card}

          // 🔥 hover effect (same feel as landlord)
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-6px)'
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >

          {/* Avatar */}
          <div style={styles.tenantAvatar}>
            {t.name?.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <h3 style={styles.cardTitle}>{t.name}</h3>

          {/* Info */}
          <div style={styles.infoGroup}>
            {t.email && <p style={styles.cardInfo}>📧 {t.email}</p>}
            {t.phone && <p style={styles.cardInfo}>📱 {t.phone}</p>}
            {t.propertyAddress && (
              <p style={styles.cardInfo}>🏠 {t.propertyAddress}</p>
            )}
          </div>

          {/* Footer */}
          <div style={styles.cardFooter}>
            <span style={styles.smallBadge}>ID: {t.id}</span>
          </div>

        </div>
      ))}
    </div>
  )}
</div>
 
    </div>
  )
}
 
const styles = {
  container: { padding: '30px', marginTop: '70px', minHeight: '100vh', backgroundColor: '#0f0f1a', color: 'white' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0f1a' },
  spinner: { width: '40px', height: '40px', border: '3px solid #2a2a3f', borderTop: '3px solid #e94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
 
  backBtn: { background: 'none', border: 'none', color: '#aaa', fontSize: '14px', cursor: 'pointer', padding: '0', marginBottom: '24px', transition: 'color 0.2s', fontWeight: '500' },
 
  profileCard: { backgroundColor: '#1e1e2f', border: '1px solid #2a2a3f', borderRadius: '16px', padding: '28px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  profileLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#e94560', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', flexShrink: 0 },
  profileName: { fontSize: '26px', margin: '0 0 8px', color: 'white', fontWeight: '700' },
  idBadge: { backgroundColor: '#2a2a3f', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#e94560', fontWeight: '600' },
  profileRight: { display: 'flex', flexDirection: 'column', gap: '10px' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  contactIcon: { fontSize: '16px' },
  contactText: { color: '#ccc', fontSize: '15px' },
 
  statsRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
  statCard: { backgroundColor: '#1e1e2f', border: '1px solid #2a2a3f', padding: '16px 32px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  statNumber: { fontSize: '28px', fontWeight: '700', color: '#e94560' },
  statLabel: { fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
 
  section: { marginBottom: '36px' },
  sectionTitle: { fontSize: '20px', color: 'white', margin: '0 0 16px', fontWeight: '600' },
 
  emptyCard: { backgroundColor: '#1e1e2f', border: '1px dashed #2a2a3f', borderRadius: '12px', padding: '32px', textAlign: 'center' },
  emptyText: { color: '#555', margin: 0, fontSize: '14px' },
 
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  card: { backgroundColor: '#1e1e2f', border: '1px solid #2a2a3f', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer', position: 'relative' },
  cardIcon: { fontSize: '32px', marginBottom: '10px' },
  tenantAvatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', margin: '0 auto 10px' },
  cardTitle: { fontSize: '16px', margin: '0 0 8px', color: 'white', fontWeight: '600' },
  cardInfo: { color: '#aaa', fontSize: '13px', margin: '4px 0' },
  cardInfoHighlight: { color: '#4CAF50', fontWeight: 'bold', marginTop: '6px' },
  smallBadge: { marginTop: '12px', display: 'inline-block', backgroundColor: '#2a2a3f', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#e94560' },
  tenantAvatar: {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#4CAF50',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 auto 12px'
},

infoGroup: {
  marginTop: '10px',
  marginBottom: '10px'
},

cardFooter: {
  marginTop: '10px'
},

card: {
  backgroundColor: '#1e1e2f',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #2a2a3f',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  cursor: 'pointer'
},

cardTitle: {
  fontSize: '18px',
  margin: '8px 0',
  color: 'white'
},

cardInfo: {
  color: '#aaa',
  fontSize: '14px',
  margin: '4px 0'
},

smallBadge: {
  backgroundColor: '#2a2a3f',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#e94560'
}
}
 
export default LandlordDetails
 