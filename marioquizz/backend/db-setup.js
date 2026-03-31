require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSetup() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const sqlPath = path.join(__dirname, 'setup.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error(" Fichier setup.sql non trouvé !");
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log(" Connexion à la base de données...");
    console.log(" Exécution du script setup.sql...");
    
    await pool.query(sql);
    
    console.log(" Base de données mise à jour avec succès !");
    
  } catch (err) {
    console.error(" Erreur lors de la configuration de la base de données :");
    console.error(err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSetup();
