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
      <p style={{ color: 'white' }}>Loading...</p>
    </div>
  )

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏠 Landlords</h1>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setErrors({}) }}>
          {showForm ? "Cancel" : "+ Add Landlord"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={styles.form}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>Add New Landlord</h3>

          {/* 🔴 General error banner */}
          {errors.general && (
            <div style={styles.generalError}>
              🚨 {errors.general}
            </div>
          )}

          <div>
            <input
              style={{ ...styles.input, border: errors.name ? '1px solid #ff4d4f' : '1px solid #333' }}
              placeholder="Full Name"
              value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
            />
            {errors.name && <p style={styles.errorText}>⚠️ {errors.name}</p>}
          </div>

          <div>
            <input
              style={{ ...styles.input, border: errors.email ? '1px solid #ff4d4f' : '1px solid #333' }}
              placeholder="Email"
              value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
            />
            {errors.email && <p style={styles.errorText}>⚠️ {errors.email}</p>}
          </div>

          <div>
            <input
              style={{ ...styles.input, border: errors.phone ? '1px solid #ff4d4f' : '1px solid #333' }}
              placeholder="Phone (10 digits)"
              value={form.phone}
              onChange={e => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }) }}
            />
            {errors.phone && <p style={styles.errorText}>⚠️ {errors.phone}</p>}
          </div>

          <button style={styles.submitBtn} onClick={handleSubmit}>
            Save Landlord
          </button>
        </div>
      )}

      {/* Stats */}
      <div style={styles.statsBox}>
        <p style={styles.statsText}>Total Landlords: <strong>{landlords.length}</strong></p>
      </div>

      {/* Landlord Cards */}
      <div style={styles.grid}>
        {landlords.map((l) => (
          <div 
            key={l.id} 
            style={styles.card}
            onClick={() => navigate(`/landlords/${l.id}`)}
          >
            <div style={styles.avatar}>{l.name.charAt(0).toUpperCase()}</div>
            <h3 style={styles.name}>{l.name}</h3>
            <p style={styles.info}>📧 {l.email}</p>
            <p style={styles.info}>📱 {l.phone}</p>
            <div style={styles.idBadge}>ID: {l.id}</div>
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            cursor='pointer'
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '30px', marginTop: '70px', minHeight: '100vh', backgroundColor: '#0f0f1a', color: 'white' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0f1a' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '32px', margin: 0, color: '#e94560' },
  addBtn: { backgroundColor: '#e94560', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
  form: { backgroundColor: '#1e1e2f', padding: '25px', borderRadius: '12px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', backgroundColor: '#2a2a3f', color: 'white', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  submitBtn: { backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  statsBox: { backgroundColor: '#1e1e2f', padding: '15px 20px', borderRadius: '10px', marginBottom: '25px', display: 'inline-block' },
  statsText: { margin: 0, color: '#aaa', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1e1e2f', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #2a2a3f', transition: 'transform 0.2s' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e94560', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 15px' },
  name: { fontSize: '20px', margin: '0 0 10px', color: 'white' },
  info: { color: '#aaa', margin: '5px 0', fontSize: '14px' },
  idBadge: { marginTop: '15px', display: 'inline-block', backgroundColor: '#2a2a3f', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#e94560' },

  // ✅ NEW — error styles
  generalError: { backgroundColor: '#2d0a0a', border: '1px solid #ff4d4f', color: '#ff4d4f', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500' },
  errorText: { color: '#ff4d4f', fontSize: '13px', margin: '4px 0 0' }
}

export default Landlords