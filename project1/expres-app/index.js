import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@db.default.svc.cluster.local:5432/postgres",
});

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  }
    catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/data', async (req, res) => {
  const { name, email } = req.body;
    try {
    const result = await pool.query("INSERT INTO users (name) VALUES ($1) RETURNING *", [req.body.name]);
    res.json(result.rows[0]);
  }
    catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )`);
}

initDb();