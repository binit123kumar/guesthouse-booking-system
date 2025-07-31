import React from 'react';
import banner from '../assets/banner.jpg';

function Banner() {
  return (
    <div>
      <img
        src={banner}
        alt="AKU Campus Banner"
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          borderBottom: '4px solid #003366',
        }}
      />
    </div>
  );
}

export default Banner;
