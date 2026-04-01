import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🏠 RentManager</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/landlords" style={styles.link}>Landlords</Link>
        <Link to="/properties" style={styles.link}>Properties</Link>
        <Link to="/tenants" style={styles.link}>Tenants</Link>
        <Link to="/payments" style={styles.link}>Payments</Link>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1a1a2e',
    color: 'white'
  },
  logo: {
    margin: 0,
    color: '#e94560'
  },
  links: {
    display: 'flex',
    gap: '20px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px'
  }
}

export default Navbar