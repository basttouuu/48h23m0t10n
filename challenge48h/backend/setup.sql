-- Script SQL à exécuter dans pgAdmin (Query Tool)
-- Base de données : quizz_lent

-- 1. Créer la table users
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  google_id    TEXT UNIQUE NOT NULL,
  pseudo       TEXT,
  name         TEXT,
  email        TEXT,
  picture      TEXT,
  total_score  INTEGER DEFAULT 0,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- 2. Ajouter les colonnes hint et explanation aux questions (si pas encore fait)
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hint TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT;

-- 3. Vérification
SELECT 'Tables prêtes !' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
