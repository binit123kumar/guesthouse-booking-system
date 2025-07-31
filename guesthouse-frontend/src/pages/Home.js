import React from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import Footer from '../components/Footer';

function Home() {
  return (
    <div>
      {/* Banner Image */}
      <Banner />

      {/* Welcome Section */}
      <div style={styles.heroContainer}>
        <h1 style={styles.heading}>Welcome to AKU Guest House</h1>
        <p style={styles.subtext}>
          Comfortable & professional stay for faculty, guests, and visitors.
        </p>
        <Link to="/booking" style={styles.button}>Book Now</Link>
      </div>

      {/* Why Choose Us Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Choose Our Guest House?</h2>
        <div style={styles.cardGrid}>
          <div style={styles.card}>🛏️ Comfortable Rooms</div>
          <div style={styles.card}>🌐 Free Wi‑Fi</div>
          <div style={styles.card}>🍽️ Dining Facility</div>
          <div style={styles.card}>🧼 Clean & Hygienic</div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const styles = {
  heroContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#f5f9fc',
  },
  heading: {
    fontSize: '32px',
    color: '#003366',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  subtext: {
    fontSize: '17px',
    color: '#555',
    margin: '15px 0 30px',
  },
  button: {
    backgroundColor: '#003366',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  section: {
    padding: '60px 20px',
    background: '#ffffff',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#003366',
    marginBottom: '30px',
  },
  cardGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  card: {
    background: '#f0f4f8',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minWidth: '180px',
    fontWeight: 'bold',
  },
};

export default Home;
