import React from 'react';
import logo from '../assets/logo.png';

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="AKU Logo" style={styles.logo} />
        <div>
          <h1 style={styles.title}>Aryabhatta Knowledge University Guest House</h1>
          <p style={styles.subtitle}>Guest House Booking Portal</p>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#003366',
    padding: '15px 40px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    color: 'white',
  },
  logoContainer: { display: 'flex', alignItems: 'center' },
  logo: { height: '70px', marginRight: '20px' },
  title: { margin: 0, fontSize: '22px', fontWeight: 'bold' },
  subtitle: { margin: 0, fontSize: '14px', color: '#cce6ff' },
};

export default Header;
