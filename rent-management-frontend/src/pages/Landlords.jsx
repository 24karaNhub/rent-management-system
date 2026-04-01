import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getLandlords, addLandlord } from '../service/LandlordService'

function Landlords() {
  const [landlords, setLandlords] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    getLandlords()
      .then(res => { setLandlords(res.data); setLoading(false) })
      .catch(err => { console.error("ERROR:", err); setLoading(false) })
  }, [])

  const handleSubmit = () => {
    setErrors({})
    addLandlord(form)
      .then(() => {
        setShowForm(false)
        setForm({ name: '', email: '', phone: '' })
        getLandlords().then(res => setLandlords(res.data))
      })
      .catch(err => {
        if (err.response) {
          const data = err.response.data
          if (typeof data === 'object' && !Array.isArray(data)) {
            setErrors(data)
          } else {
            setErrors({ general: data.message || "Validation failed" })
          }
        } else {
          setErrors({ general: "Cannot connect to server!" })
        }
      })
  }

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner} />
    </div>
  )

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏠 Landlords</h1>
          <p style={styles.subtitle}>Manage your property owners</p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => { setShowForm(!showForm); setErrors({}) }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c73652'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e94560'}
        >
          {showForm ? "✕ Cancel" : "+ Add Landlord"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={styles.form}>
          <h3 style={styles.formTitle}>Add New Landlord</h3>

          {errors.general && (
            <div style={styles.generalError}>🚨 {errors.general}</div>
          )}

          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Full Name</label>
              <input
                style={{ ...styles.input, borderColor: errors.name ? '#ff4d4f' : '#2a2a3f' }}
                placeholder="e.g. Karan Singh"
                value={form.name}
                onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
              />
              {errors.name && <p style={styles.errorText}>⚠️ {errors.name}</p>}
            </div>

            <div>
              <label style={styles.label}>Email Address</label>
              <input
                style={{ ...styles.input, borderColor: errors.email ? '#ff4d4f' : '#2a2a3f' }}
                placeholder="e.g. karan@gmail.com"
                value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
              />
              {errors.email && <p style={styles.errorText}>⚠️ {errors.email}</p>}
            </div>

            <div>
              <label style={styles.label}>Phone Number</label>
              <input
                style={{ ...styles.input, borderColor: errors.phone ? '#ff4d4f' : '#2a2a3f' }}
                placeholder="10 digits, e.g. 9876543210"
                value={form.phone}
                onChange={e => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }) }}
              />
              {errors.phone && <p style={styles.errorText}>⚠️ {errors.phone}</p>}
            </div>
          </div>

          <button
            style={styles.submitBtn}
            onClick={handleSubmit}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3d8b40'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            ✓ Save Landlord
          </button>
        </div>
      )}

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{landlords.length}</span>
          <span style={styles.statLabel}>Total Landlords</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{landlords.filter(l => l.name).length}</span>
          <span style={styles.statLabel}>Active</span>
        </div>
      </div>

      {/* Landlord Cards */}
      <div style={styles.grid}>
        {landlords.map((l) => (
          <div
            key={l.id}
            style={{
              ...styles.card,
              transform: hoveredCard === l.id ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hoveredCard === l.id ? '0 8px 30px rgba(233,69,96,0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
              borderColor: hoveredCard === l.id ? '#e94560' : '#2a2a3f',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/landlords/${l.id}`)}
            onMouseEnter={() => setHoveredCard(l.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardTop}>
              <div style={styles.avatar}>{l.name?.charAt(0).toUpperCase()}</div>
              <div style={styles.idBadge}>ID: {l.id}</div>
            </div>
            <h3 style={styles.name}>{l.name}</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>📧</span>
              <span style={styles.info}>{l.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>📱</span>
              <span style={styles.info}>{l.phone}</span>
            </div>
            <div style={styles.viewBtn}>View Details →</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '30px', marginTop: '70px', minHeight: '100vh', backgroundColor: '#0f0f1a', color: 'white' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0f1a' },
  spinner: { width: '40px', height: '40px', border: '3px solid #2a2a3f', borderTop: '3px solid #e94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  title: { fontSize: '32px', margin: '0 0 4px', color: '#e94560', fontWeight: '700' },
  subtitle: { margin: 0, color: '#666', fontSize: '14px' },
  addBtn: { backgroundColor: '#e94560', color: 'white', border: 'none', padding: '12px 22px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'background-color 0.2s' },

  form: { backgroundColor: '#1e1e2f', padding: '28px', borderRadius: '14px', marginBottom: '28px', border: '1px solid #2a2a3f' },
  formTitle: { color: 'white', margin: '0 0 20px', fontSize: '18px', fontWeight: '600' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' },
  label: { display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '6px', fontWeight: '500' },
  input: { padding: '12px 14px', borderRadius: '8px', border: '1px solid #2a2a3f', backgroundColor: '#2a2a3f', color: 'white', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  submitBtn: { backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '13px 28px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', transition: 'background-color 0.2s' },

  generalError: { backgroundColor: '#2d0a0a', border: '1px solid #ff4d4f', color: '#ff4d4f', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', marginBottom: '16px' },
  errorText: { color: '#ff4d4f', fontSize: '12px', margin: '5px 0 0' },

  statsRow: { display: 'flex', gap: '16px', marginBottom: '28px' },
  statCard: { backgroundColor: '#1e1e2f', border: '1px solid #2a2a3f', padding: '16px 28px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  statNumber: { fontSize: '28px', fontWeight: '700', color: '#e94560' },
  statLabel: { fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1e1e2f', padding: '24px', borderRadius: '14px', border: '1px solid #2a2a3f', transition: 'all 0.2s ease' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  avatar: { width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#e94560', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700' },
  idBadge: { backgroundColor: '#2a2a3f', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', color: '#e94560', fontWeight: '600' },
  name: { fontSize: '18px', margin: '0 0 12px', color: 'white', fontWeight: '600' },
  infoRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  infoIcon: { fontSize: '13px' },
  info: { color: '#aaa', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  viewBtn: { marginTop: '16px', color: '#e94560', fontSize: '13px', fontWeight: '600', textAlign: 'right' }
}

export default Landlords
