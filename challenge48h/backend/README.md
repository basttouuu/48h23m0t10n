# Backend - Mario Quiz

Ce dossier contient le serveur API pour le Mario Quiz.

## Installation

```bash
npm install
```

## Base de données (Neon)

### 1. Configuration initiale
Assurez-vous d'avoir un fichier `.env` avec votre `DATABASE_URL`.
Pour créer ou mettre à jour les tables :
```bash
npm run db:setup
```

### 2. Peupler la base (Seeder)
Pour ajouter les questions Mario par défaut (cela vide d'abord la table `questions`) :
```bash
npm run db:seed
```

## Lancement
```bash
npm start
```
