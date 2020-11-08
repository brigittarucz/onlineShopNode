const mysql = require('mysql2');

// REDUCE TIME SPENT CONNECTING TO SQL BY 
// REUSING PREVIOUS CONNECTIONS FROM THE POOL

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'beauty_shop',
    password: 'password',
    port: 3308
});

module.exports = pool.promise();