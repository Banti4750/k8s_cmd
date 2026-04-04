import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import ioredis from 'ioredis';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const redis = new ioredis({
    host: 'redis.default.svc.cluster.local',
    port: 6379,
});

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@db.default.svc.cluster.local:5432/postgres",
});

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    redis.set('users', JSON.stringify(result.rows), 'EX', 600); // Cache for 1 hour
    res.json(result.rows);
  }
    catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/data/cached', async (req, res) => {
    try {
        const cachedData = await redis.get('users');
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
        const result = await pool.query("SELECT * FROM users");
        redis.set('users', JSON.stringify(result.rows), 'EX', 600);
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