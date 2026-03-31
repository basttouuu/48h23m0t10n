require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Racine pour test
app.get('/', (req, res) => {
  res.send(' Backend Mario Quiz 48h opérationnel ! Les questions sont à /api/questions');
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});



pool.query('SELECT current_database(), NOW()', (err, res) => {
  if (err) console.error(' Erreur PostgreSQL :', err.message);
  else {
    console.log(' Connexion réussie !');
    console.log(' Base :', res.rows[0].current_database);
    
    // Initialisation de la table users si besoin
    pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id TEXT UNIQUE,
        pseudo TEXT,
        name TEXT,
        email TEXT,
        picture TEXT,
        total_score INTEGER DEFAULT 0
      );
    `).catch(e => console.error("Erreur init table users:", e.message));
  }
});

// ─── Routes API ───

// 1. Questions (avec hint et explanation si disponibles)
app.get('/api/questions', async (req, res) => {
  try {
    let result;
    try {
      result = await pool.query(
        'SELECT id, content, option_a, option_b, option_c, option_d, solution, hint, explanation FROM questions ORDER BY id ASC'
      );
    } catch {
      result = await pool.query('SELECT * FROM questions ORDER BY id ASC');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur récupération questions" });
  }
});

// 2. Indice pour une question
app.get('/api/questions/:id/hint', async (req, res) => {
  try {
    const result = await pool.query('SELECT hint FROM questions WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Question non trouvée" });
    res.json({ hint: result.rows[0].hint || "Aucun indice disponible." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Sauvegarde du score en fin de partie (Simple Pseudo)
app.post('/api/save-score', async (req, res) => {
  const { playerName, score } = req.body;
  if (!playerName) return res.status(400).json({ error: "Nom du joueur manquant" });
  
  try {
    // On insère simplement une nouvelle ligne pour le classement avec le pseudo
    await pool.query(
      `INSERT INTO users (pseudo, total_score) VALUES ($1, $2)`,
      [playerName, score]
    );
    res.json({ message: "Score sauvegardé" });
  } catch (err) {
    console.error('Erreur save-score:', err.message);
    res.status(500).json({ error: "Erreur lors de la sauvegarde" });
  }
});

// 4. Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT pseudo, total_score FROM users ORDER BY total_score DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch {
    res.json([]);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(` Backend sur http://localhost:${PORT}`));