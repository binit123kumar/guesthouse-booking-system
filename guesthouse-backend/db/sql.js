const config = {
  user: 'your_sql_username',          // <-- अपना username डालें
  password: 'your_sql_password',      // <-- अपना password डालें
  server: 'localhost',                // या 'DESKTOP-XXXX\\SQLEXPRESS'
  database: 'GuestHouseDB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

module.exports = config;
