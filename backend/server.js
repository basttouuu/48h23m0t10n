require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Vérification de la connexion et du nom de la base au démarrage
pool.query('SELECT current_database(), NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur de connexion PostgreSQL :', err.message);
  } else {
    console.log('✅ Connexion réussie !');
    console.log('📂 Base de données active :', res.rows[0].current_database);
    console.log('⏰ Heure du serveur DB :', res.rows[0].now);
  }
});

// --- ROUTES API ---

// 1. Récupérer toutes les questions
app.get('/api/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des questions" });
  }
});

// 2. Mettre à jour le score d'un utilisateur (Exemple pour plus tard)
app.post('/api/update-score', async (req, res) => {
  const { userId, points } = req.body;
  try {
    await pool.query('UPDATE users SET total_score = total_score + $1 WHERE id = $2', [points, userId]);
    res.json({ message: "Score mis à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});