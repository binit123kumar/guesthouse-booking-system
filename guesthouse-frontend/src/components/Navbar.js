import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/booking" style={styles.link}>Book Now</Link></li>
        <li><Link to="/admin" style={styles.link}>Admin</Link></li>
        <li><Link to="/contact" style={styles.link}>Contact</Link></li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: { backgroundColor: '#002244', padding: '10px 40px' },
  navList: { listStyle: 'none', display: 'flex', gap: '30px', justifyContent: 'center', margin: 0, padding: 0 },
  link: { color: 'white', textDecoration: 'none', fontWeight: '500' },
};

export default Navbar;
