const { Pool } = require('pg')
const pool = new Pool({ connectionString: 'postgres://admin:secret123@postgres:5432/hello_visitor' })
const query = (text, params) => pool.query(text, params)
module.exports = { query }
