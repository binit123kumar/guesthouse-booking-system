const config = {
  user: 'your_sql_username',          // <-- Enter your username
  password: 'your_sql_password',      // <-- Enter your password
  server: 'localhost',                // or 'DESKTOP-XXXX\\SQLEXPRESS'
  database: 'GuestHouseDB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

module.exports = config;