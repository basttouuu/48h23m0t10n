const { Pool } = require('pg');

async function migrate() {
  console.log("🚀 Démarrage de la migration Local -> Neon...");

  // 1. Connexion à ta base locale (Source)
  const localPool = new Pool({
    user: 'postgres',
    password: 'root',
    host: '127.0.0.1',
    port: 5432,
    database: 'quizz_lent',
  });

  // 2. Connexion à Neon (Destination)
  const neonPool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_3eYMCxmBjW2N@ep-damp-morning-amjvdn1m-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
  });

  try {
    // A. Recréer les tables sur Neon
    console.log("🔨 Création des tables sur Neon...");
    await neonPool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        solution TEXT,
        hint TEXT,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await neonPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id TEXT UNIQUE NOT NULL,
        name TEXT,
        email TEXT,
        picture TEXT,
        total_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // B. Vider les tables Neon par sécurité (si on relance le script)
    await neonPool.query('TRUNCATE TABLE questions RESTART IDENTITY CASCADE');
    await neonPool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

    // C. Migrer les questions
    console.log("📦 Récupération des questions locales...");
    const localQuestions = await localPool.query('SELECT * FROM questions');
    
    if (localQuestions.rows.length > 0) {
      console.log(`⏳ Transfert de ${localQuestions.rows.length} questions...`);
      for (const q of localQuestions.rows) {
        await neonPool.query(`
          INSERT INTO questions (id, content, option_a, option_b, option_c, option_d, solution, hint, explanation)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [q.id, q.content, q.option_a, q.option_b, q.option_c, q.option_d, q.solution, q.hint, q.explanation]);
      }
    }

    // D. Migrer les utilisateurs
    console.log("👥 Récupération des utilisateurs locaux...");
    try {
      const localUsers = await localPool.query('SELECT * FROM users');
      if (localUsers.rows.length > 0) {
        console.log(`⏳ Transfert de ${localUsers.rows.length} utilisateurs...`);
        for (const u of localUsers.rows) {
          await neonPool.query(`
            INSERT INTO users (id, google_id, name, email, picture, total_score, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [u.id, u.google_id, u.name, u.email, u.picture, u.total_score, u.created_at]);
        }
      }
    } catch (e) {
      console.log("ℹ️ Pas de table users locale trouvée (ou vide). On l'ignore.");
    }

    // E. Synchroniser les index ID
    await neonPool.query(`SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));`);
    try { await neonPool.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`); } catch(e){}

    console.log("✅✅✅ MIGRATION TERMINÉE AVEC SUCCÈS ! ✅✅✅");
  } catch (err) {
    console.error("❌ Erreur pendant la migration :", err);
  } finally {
    await localPool.end();
    await neonPool.end();
  }
}

migrate();
