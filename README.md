# 🍄 Projet Challenge 48h - 48h23m0t10n

## 🎮 Présentation du projet
Ce projet a été réalisé dans le cadre du **Challenge 48h**. 
Il s'agit d'une plateforme d'Escape Game hybride prenant la forme d'un système d'exploitation simulé dans un navigateur, contenant une série de défis à résoudre pour atteindre le cœur du système.

**L'expérience se divise en plusieurs phases :**
1. **Le Navigateur (KoopaSearch) :** Un faux navigateur simulant un moteur de recherche, servant de "Hub" et cachant l'accès aux diverses épreuves.
2. **Partie 1 : Mario Quiz Adventure :** Un mini-jeu interactif où le joueur doit répondre à des questions de développement / culture g tech, en étant poursuivi par un Boss (Bowser). Réussir cette phase donne accès aux serveurs secrets de l'entreprise maléfique "Koopa Corp".
3. **Partie 2 : Pare-feu EPSILON (Koopa Corp) :** Le joueur s'infiltre sur le réseau de Koopa Corp et doit faire face à 10 barrières de sécurité fictives en exploitant les failles web (LocalStorage, Cookies, Variables Globales, Appels Réseau cachés...).
4. **Partie 3 : Le Cœur de Réseau (Terminal) :** L'épreuve finale dans un terminal en ligne de commande pour arrêter l'arme ultime.

L'ensemble des phases est complètement lié : une sécurité vérifie l'accomplissement des parties précédentes avant de débloquer la suite.


## 🚀 Technologies Utilisées
- **Frontend :** **React (Vite🚀)** pour une application ultra-réactive. Utilisation de CSS modulaire et de composants structurés.
- **Backend :** **Node.js & Express** pour gérer l'API et les questions/scores.
- **Base de Données :** **PostgreSQL** pour stocker les classements des joueurs et la liste des QCM.


---

## ⚙️ Guide d'installation

### Prérequis
- [Node.js](https://nodejs.org/) installé (v16+)
- [PostgreSQL](https://www.postgresql.org/) installé avec une base de données locale nommée `quizz_lent`

---

### Étape 1 : Backend (Serveur & Base de données)
1. Ouvrir un terminal dans le dossier `challenge48h/backend/`
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer un fichier `.env` basé sur vos identifiants PostgreSQL :
   ```env
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=quizz_lent
   PORT=3001
   GOOGLE_CLIENT_ID=votre_client_id_google
   ```
4. Initialiser la BD (optionnel si le setup SQL a été fait manuellement) et lancer le serveur :
   ```bash
   npm start
   ```

---

### Étape 2 : Frontend (Jeu React)
1. Ouvrir un terminal dans le dossier `challenge48h/frontend/`
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
4. Ouvrir l'URL affichée (généralement `http://localhost:5173/` ou `http://localhost:5174/`) dans un navigateur. Bon jeu !

---

*Développé dans un contexte intensif de hackathon.*


