# 48h23m0t10n - Challenge 48H

Bienvenue dans le dépôt du challenge 48h. Ce projet est un jeu d'énigmes et de hacking en 3 parties, avec une interface simulant un système d'exploitation de type "Bureau" complet : un Navigateur web (avec moteur de recherche KoopaSearch), une application Mail et des écrans interactifs.

---

## 🚀 Installation & Lancement

Le projet est divisé en deux parties : un backend (API Node.js + Base de données PostgreSQL) et un frontend (React / Vite).

### Prérequis
- Docker et Docker Compose (pour lancer rapidement la base de données)
- Node.js (v18+)

### Lancement avec Docker et en local
1. **Démarrer la base de données** :  
   Dans le dossier `challenge48h`, un fichier `docker-compose.yml` est présent. Vous pouvez lancer la base :
   ```bash
   cd challenge48h
   docker compose up -d
   ```
   *Assurez-vous que l'URL de base de données (DATABASE_URL) pointant vers Postgres soit bien configurée.*

2. **Backend (API)** :
   ```bash
   cd backend
   npm install
   npm run db:setup   # Pour créer la table de questions
   npm run db:seed    # Pour peupler la base avec les questions
   npm start          # Lance le serveur sur le port configuré
   ```

3. **Frontend (Jeu React)** :
   Ouvrir un nouveau terminal.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Puis ouvrez votre navigateur sur `http://localhost:5173`.

---

## 🎮 Solution détaillée : Comment faire les parties du jeu

Le jeu évolue au fur et à mesure que vous validez les étapes. Chaque victoire débloque des éléments supplémentaires dans le système de recherche virtuel "KoopaSearch" du faux navigateur.

### Accueil (Le Bureau)
Pour démarrer, cliquez sur le navigateur internet sur le "Bureau" numérique du jeu.
Tapez n'importe quelle recherche dans "KoopaSearch" (le champ de texte) pour afficher des résultats.

---

### Partie 1 : Mario Quiz Adventure
**Comment y accéder :**
Dans les résultats d'une recherche sur KoopaSearch, trouvez et cliquez sur le lien `Révision avec Mario Quiz Adventure` (mario-quiz.io/play).

**Comment gagner :**
Il s'agit d'un QCM basique récupérant les données de l'API. Rentrez votre pseudonyme et choisissez les bonnes réponses. 
*Une fois fini, vous serez ramené au Bureau. De nouveaux résultats de recherche seront désormais disponibles (via flag `part1_completed` dans votre localStorage).*

---

### Partie 2 : Le Pare-feu EPSILON 
**Comment y accéder :**
Comme la Partie 1 a été vaincue, retournez dans le navigateur Web et faites une recherche. Un nouveau lien apparaîtra parmi les résultats de recherche : `Koopa Corp - Portail Sécurité Interne (sec.koopacorp.biz/login)`. 
Cliquez dessus pour accéder aux **10 barrières** (Firewall EPSILON).

**Comment gagner :**
Vous devez pirater consécutivement 10 écrans d'authentification en utilisant les outils de développement de votre vrai navigateur (F12 : Inspecteur d'éléments, Console, Réseau...).

Voici les solutions exactes pour chaque barrière :

1. **Barrière 1** : `html_is_easy`
   *Comment faire :* Inspectez l'élément de la page (onglet "Elements"). Un commentaire HTML caché contient le mot de passe.
2. **Barrière 2** : `js_console_pw`
   *Comment faire :* Ouvrez la "Console" JavaScript. Tapez `window.backup_password` ou `backup_password`.
3. **Barrière 3** : `css_master`
   *Comment faire :* Inspectez les éléments. Il y a une balise ayant la classe `secret-pass` et `display: none` contenant ce mot de passe.
4. **Barrière 4** : `local_storage_key`
   *Comment faire :* Allez dans l'onglet "Application" > Storage > "Local Storage". Un token admin `adminToken` y est stocké avec cette valeur.
5. **Barrière 5** : `cookie_monster_pw`
   *Comment faire :* Toujours dans "Application" > Storage > "Cookies". La clé se trouve dans la valeur du cookie `session_token`.
6. **Barrière 6** : `base64_decode`
   *Comment faire :* L'indice affiché contient une chaîne en Base64 : `YmFzZTY0X2RlY29kZQ==`. Décodez-la.
7. **Barrière 7** : `hidden_value_pw`
   *Comment faire :* Inspectez le DOM, un `<input type="hidden">` a pour ID `hidden_admin_key` et la valeur `hidden_value_pw`.
8. **Barrière 8** : `network_tab_pw`
   *Comment faire :* Allez dans l'onglet "Network / Réseau". Rechargez ou observez la requête locale générée. Son payload contient le token.
9. **Barrière 9** : `console_log_pw`
   *Comment faire :* Regardez la Console de votre navigateur, un message d'erreur d'Administration imprime en rouge ce mot de passe de secours.
10. **Barrière 10** : `call_me_pw`
    *Comment faire :* Dans la Console, une fonction a été créée. Appelez-la en tapant `getFlag()`.

*Une fois les 10 barrières passées, l'accès terminal sera autorisé (flag `barrier10` dans localStorage).*

---

### Partie 3 : Hack Final & Survie Cœur de Réseau
**Comment y accéder :**
Maintenant que le pare-feu EPSILON est tombé, vous avez accès au cœur de réseau. Sur le bureau, une animation "Glitch" remplacera certains éléments ou vous pouvez y accéder directement depuis le lien `Accès Terminal - Cœur de Réseau` apparu dans la barre de recherche du navigateur.

**Comment gagner :**
Cette phase comporte deux épreuves consécutives.
1. **QCM Cybersécurité :**
   Il faudra répondre sous pression à 6 questions sur le monde du Dev/Cybersécurité.
   **Réponses :**
   1. *Attaque qui envoie du trafic pour saturer la cible ?* -> **DDoS**
   2. *En OWASP Top 10, "Injection" concerne surtout..* -> **Données non fiables interprétées comme commande**
   3. *Pour prouver l'intégrité d'un fichier...* -> **Un hash cryptographique (SHA-256, etc.)**
   4. *Dernier verrou : extraire les logs sans laisser de trace...* -> **Chaînage / anonymisation + bonnes pratiques opsec**
   5. *Le plus sûr pour stocker un mot de passe côté serveur...* -> **Hashé avec sel + algo adapté (ex: bcrypt/argon2)**
   6. *Sur une page de login... quelle protection réduit le bruteforce ?* -> **Limiter les tentatives + délai progressif**