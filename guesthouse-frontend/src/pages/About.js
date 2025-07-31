import React from 'react';

function About() {
  return (
    <div style={styles.container}>
      <h1>About Aryabhatta Knowledge University</h1>
      <p>
        Aryabhatta Knowledge University (AKU), Patna, is established by the Government of Bihar to develop and manage educational infrastructure for technical, medical, management and allied professional education.
      </p>
      <p>
        The university provides a quality stay and guest facility to visiting faculty, dignitaries, and scholars through its dedicated guest house.
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: 'auto',
    color: '#333',
    lineHeight: '1.6',
  },
};

export default About;
