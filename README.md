# Mario Quiz Adventure - 48h Challenge

## Présentation du projet
Ce projet a été réalisé dans le cadre du **Challenge 48h**. 
Il s'agit d'une **plateforme interactive** proposant une série de défis et d'énigmes sous la forme d'un mini-jeu. 

**Le concept :** Mario est poursuivi par un Boss (Goomba/Bowser) dans un environnement dynamique. Pour avancer et ouvrir les portes, le joueur doit résoudre des quiz (logique, culture générale, algorithmique, etc.). 
Le thème visuel est **rétro-gaming immersif (style CodinGame)** avec un mode sombre, des effets néons, et un gameplay orienté sur le challenge (timer, vies limitées, conséquences en cas d'erreur).

### Objectifs remplis
- **Plateforme de défis interactifs :** Résoudre des questions pour faire avancer le personnage.
- **Difficulté et thème cohérent :** Thème rétro 16-bits, interface propre et unifiée. Boss qui avance en cas d'erreur ou d'indice utilisé.
- **Technologies :** Frontend en **React/Vite** (framework ReactJS), Backend en **Node.js/Express**, Base de données **PostgreSQL**.
- **Code versionné :** Dépôt Git initialisé pour le travail en équipe.

---

## Guide d'installation

### Prérequis
- \Node.js\ installé (v16+)
- \PostgreSQL\ installé avec une base de données locale nommée \quizz_lent\

### 1. Backend (Serveur & Base de données)
1. Ouvrir un terminal dans le dossier \backend\
2. Installer les dépendances :
   \\\bash
   npm install
   \\\
3. Exécuter le script SQL dans votre base de données locale (\pgAdmin\ ou invite de commande) :
   \\\sql
   CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     google_id TEXT UNIQUE NOT NULL,
     name TEXT,
     email TEXT,
     picture TEXT,
     total_score INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Si la table 'questions' n'a pas ces colonnes
   ALTER TABLE questions ADD COLUMN IF NOT EXISTS hint TEXT;
   ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT;
   \\\
4. Créer un fichier \.env\ basé sur vos identifiants PostgreSQL :
   \\\env
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=quizz_lent
   PORT=3001
   GOOGLE_CLIENT_ID=votre_client_id_google
   \\\
5. Lancer le serveur :
   \\\bash
   node server.js
   \\\


