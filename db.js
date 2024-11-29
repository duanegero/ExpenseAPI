const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Expenses Database',
    password: 'postgrespassword',
    port: 5433,
});

module.exports = pool;