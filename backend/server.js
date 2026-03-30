require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});



pool.query('SELECT current_database(), NOW()', (err, res) => {
  if (err) console.error('❌ Erreur PostgreSQL :', err.message);
  else {
    console.log('✅ Connexion réussie !');
    console.log('📂 Base :', res.rows[0].current_database);
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

// 3. Authentification Google (vérification du token côté serveur)
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Token Google manquant" });

  try {
    // Décoder le JWT Google (sans vérif cryptographique pour la démo)
    // En production : utiliser la librairie google-auth-library
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

    const { sub: googleId, name, email, picture } = payload;

    // Upsert dans la table users (si elle existe)
    try {
      await pool.query(`
        INSERT INTO users (google_id, name, email, picture, total_score)
        VALUES ($1, $2, $3, $4, 0)
        ON CONFLICT (google_id) DO UPDATE SET name=$2, email=$3, picture=$4
      `, [googleId, name, email, picture]);
    } catch {
      // Table users peut ne pas exister encore — on ignore
    }

    res.json({ success: true, user: { googleId, name, email, picture } });
  } catch (err) {
    console.error('Erreur auth Google:', err.message);
    res.status(500).json({ error: "Erreur vérification token Google" });
  }
});

// 4. Mise à jour du score (par ID interne)
app.post('/api/update-score', async (req, res) => {
  const { userId, points } = req.body;
  try {
    await pool.query(
      'UPDATE users SET total_score = total_score + $1 WHERE id = $2',
      [points, userId]
    );
    res.json({ message: "Score mis à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Sauvegarde du score en fin de partie (par google_id)
app.post('/api/save-score', async (req, res) => {
  const { googleId, score } = req.body;
  if (!googleId) return res.status(400).json({ error: "googleId manquant" });
  try {
    await pool.query(
      `UPDATE users SET total_score = GREATEST(total_score, $1) WHERE google_id = $2`,
      [score, googleId]
    );
    res.json({ message: "Score sauvegardé" });
  } catch (err) {
    console.error('Erreur save-score:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// 5. Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, picture, total_score FROM users ORDER BY total_score DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch {
    res.json([]); // Silencieux si table n'existe pas
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend sur http://localhost:${PORT}`));