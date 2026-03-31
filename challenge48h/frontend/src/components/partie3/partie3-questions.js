export const PART3_MS = 12000;

export const QUESTIONS = [
  {
    text: "Attaque qui envoie du trafic pour saturer la cible ?",
    options: ["XSS stocké", "Phishing", "Man-in-the-middle", "DDoS"],
    correct: 3,
  },
  {
    text: "En OWASP Top 10, « Injection » concerne surtout…",
    options: [
      "Les cookies HTTPOnly",
      "Les injections CSS uniquement",
      "Données non fiables interprétées comme commande",
      "Le responsive design",
    ],
    correct: 2,
  },
  {
    text: "Pour prouver l'intégrité d'un fichier, on utilise souvent…",
    options: ["Un ping", "Un favicon", "Un GUID", "Un hash cryptographique (SHA-256, etc.)"],
    correct: 3,
  },
  {
    text: "Dernier verrou : extraire les logs sans laisser de trace IP nécessite…",
    options: [
      "Désactiver JavaScript",
      "Chaînage / anonymisation + bonnes pratiques opsec",
      "Augmenter la luminosité",
      "Un VPN public gratuit seulement",
    ],
    correct: 1,
  },
  {
    text: "Le plus sûr pour stocker un mot de passe côté serveur, c'est…",
    options: [
      "En clair dans la base",
      "Chiffré en AES avec une clé fixe dans le code",
      "Hashé avec sel + algo adapté (ex: bcrypt/argon2)",
      "Encodé en base64",
    ],
    correct: 2,
  },
  {
    text: "Sur une page de login, laquelle de ces protections réduit le risque de bruteforce ?",
    options: [
      "Augmenter la complexité du logo",
      "Limiter les tentatives + délai progressif",
      "Passer le site en HTTP uniquement",
      "Masquer le bouton « Connexion » en CSS",
    ],
    correct: 1,
  },
];
