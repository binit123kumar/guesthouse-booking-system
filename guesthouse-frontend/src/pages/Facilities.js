import React from 'react';

const facilitiesData = [
  {
    title: 'Fully Furnished Rooms',
    icon: '🛏️',
    img: 'https://via.placeholder.com/200x130?text=Rooms',
    desc: 'Spacious and well-equipped rooms designed for comfort and rest.',
  },
  {
    title: 'High-Speed Wi-Fi',
    icon: '🌐',
    img: 'https://via.placeholder.com/200x130?text=WiFi',
    desc: 'Seamless internet access in all guest rooms and premises.',
  },
  {
    title: 'Dining Services',
    icon: '🍽️',
    img: 'https://via.placeholder.com/200x130?text=Dining',
    desc: 'Nutritious meals served hygienically in a clean mess facility.',
  },
  {
    title: 'Daily Housekeeping',
    icon: '🧼',
    img: 'https://via.placeholder.com/200x130?text=Hygiene',
    desc: 'Regular room cleaning & sanitization ensuring guest hygiene.',
  },
  {
    title: 'Parking Facility',
    icon: '🅿️',
    img: 'https://via.placeholder.com/200x130?text=Parking',
    desc: 'On-campus parking available for all guests and visitors.',
  },
  {
    title: '24x7 Security',
    icon: '🔒',
    img: 'https://via.placeholder.com/200x130?text=Security',
    desc: 'CCTV surveillance and dedicated security personnel for safety.',
  },
];

function Facilities() {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>Facilities at AKU Guest House</h1>
      <div style={styles.grid}>
        {facilitiesData.map((facility, index) => (
          <div key={index} style={styles.card}>
            <img src={facility.img} alt={facility.title} style={styles.image} />
            <h3 style={styles.cardTitle}>{facility.icon} {facility.title}</h3>
            <p style={styles.desc}>{facility.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '32px',
    color: '#003366',
    marginBottom: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  card: {
    background: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  image: {
    width: '100%',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#002244',
    marginBottom: '10px',
  },
  desc: {
    fontSize: '14px',
    color: '#555',
  },
};

export default Facilities;
