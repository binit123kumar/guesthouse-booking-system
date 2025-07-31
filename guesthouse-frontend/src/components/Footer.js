import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* Address Section */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Contact Us</h4>
          <p>📍 Gyan Parisar, Mithapur,<br />Patna‑800001, Bihar, India</p>
          <p>📞 <strong>Phone:</strong> 0612‑2351919</p>
          <p>✉️ <strong>Email:</strong> info@akubihar.ac.in</p>
        </div>

        {/* Quick Links */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.linkList}>
            {/* ✅ External Link Open in Same Tab */}
            <li>
              <a 
                href="https://akubihar.ac.in/AboutUs/Introduction.aspx" 
                style={styles.link}>
                🔹 About AKU
              </a>
            </li>
            <li><Link to="/facilities" style={styles.link}>🔹 Facilities</Link></li>
            <li><Link to="/contact" style={styles.link}>🔹 Contact</Link></li>
          </ul>
        </div>

        {/* Location Map */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Our Location</h4>
          <iframe
            title="AKU Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.879651464682!2d85.12663177525689!3d25.594095577462116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed585eaa1e92db%3A0xb1770f1bb2e7c6f3!2sAryabhatta%20Knowledge%20University%2C%20Patna!5e0!3m2!1sen!2sin!4v1720787885000!5m2!1sen!2sin"
            width="250"
            height="150"
            style={{ border: 0, borderRadius: '10px' }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div style={styles.copyRight}>
        © {new Date().getFullYear()} Aryabhatta Knowledge University. All Rights Reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#002244',
    color: '#fff',
    padding: '40px 20px 10px',
    marginTop: '60px',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    maxWidth: '1100px',
    margin: 'auto',
  },
  column: {
    flex: '1',
    minWidth: '250px',
    marginBottom: '20px',
    padding: '10px',
  },
  heading: {
    fontSize: '18px',
    borderBottom: '2px solid #fff',
    paddingBottom: '8px',
    marginBottom: '10px',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    display: 'block',
    margin: '6px 0',
    transition: 'color 0.3s ease',
  },
  copyRight: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #ccc',
    fontSize: '14px',
    marginTop: '30px',
    color: '#ddd',
  },
};

export default Footer;
