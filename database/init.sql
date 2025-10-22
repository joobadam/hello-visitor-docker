CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email ON visits(email);
CREATE INDEX IF NOT EXISTS idx_created_at ON visits(created_at);
