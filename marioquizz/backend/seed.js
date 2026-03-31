require('dotenv').config();
const { Pool } = require('pg');

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const questions = [
    {
      content: "Quel est le nom du frère de Mario ?",
      option_a: "Wario",
      option_b: "Luigi",
      option_c: "Waluigi",
      option_d: "Toad",
      solution: "Luigi",
      hint: "Il porte une casquette verte.",
      explanation: "Luigi est le frère cadet de Mario et porte du vert."
    },
    {
      content: "Dans quel jeu Mario a-t-il fait sa première apparition ?",
      option_a: "Super Mario Bros.",
      option_b: "Donkey Kong",
      option_c: "Mario Kart",
      option_d: "Pac-Man",
      solution: "Donkey Kong",
      hint: "Il s'appelait 'Jumpman' à l'époque.",
      explanation: "Mario est apparu pour la première fois dans Donkey Kong (1981) en tant que Jumpman."
    },
    {
      content: "Comment s'appelle le dinosaure vert qui accompagne souvent Mario ?",
      option_a: "Rex",
      option_b: "Yoshi",
      option_c: "Birdo",
      option_d: "Bowser Jr",
      solution: "Yoshi",
      hint: "Il peut manger des ennemis avec sa langue.",
      explanation: "Yoshi est apparu pour la première fois dans Super Mario World sur SNES."
    },
    {
      content: "Qui est l'ennemi juré de Mario ?",
      option_a: "Link",
      option_b: "Bowser",
      option_c: "Ganondorf",
      option_d: "Kirby",
      solution: "Bowser",
      hint: "C'est une tortue géante cracheuse de feu.",
      explanation: "Bowser, aussi connu sous le nom de King Koopa, est le principal antagoniste."
    },
    {
      content: "Quel objet rend Mario invincible temporairement ?",
      option_a: "Le Champignon Rouge",
      option_b: "L'Étoile",
      option_c: "La Fleur de Feu",
      option_d: "La Plume",
      solution: "L'Étoile",
      hint: "Il devient multicolore et la musique change.",
      explanation: "L'Étoile (Super Star) rend Mario invincible et détruit tout sur son passage."
    },
    {
      content: "Quelle est la couleur de la casquette de Luigi ?",
      option_a: "Rouge",
      option_b: "Verte",
      option_c: "Jaune",
      option_d: "Bleue",
      solution: "Verte",
      hint: "C'est la couleur de la nature.",
      explanation: "Luigi est célèbre pour sa tenue verte."
    },
    {
      content: "Comment s'appelle la princesse que Mario doit souvent sauver ?",
      option_a: "Zelda",
      option_b: "Peach",
      option_c: "Daisy",
      option_d: "Rosalina",
      solution: "Peach",
      hint: "Elle règne sur le Royaume Champignon.",
      explanation: "La Princesse Peach est la souveraine du Mushroom Kingdom."
    },
    {
      content: "Quel métier exerçait Mario à l'origine (dans Donkey Kong) ?",
      option_a: "Plombier",
      option_b: "Charpentier",
      option_c: "Électricien",
      option_d: "Médecin",
      solution: "Charpentier",
      hint: "Il travaillait sur des chantiers avec des poutres.",
      explanation: "Dans Donkey Kong, Mario était charpentier avant de devenir plombier."
    },
    {
      content: "Quel est le nom du royaume où vit Mario ?",
      option_a: "Hyrule",
      option_b: "Royaume Champignon",
      option_c: "Dream Land",
      option_d: "Kanto",
      solution: "Royaume Champignon",
      hint: "C'est le royaume des Toads.",
      explanation: "Mario défend le Mushroom Kingdom (Royaume Champignon)."
    },
    {
      content: "Quel objet permet à Mario de lancer des boules de feu ?",
      option_a: "Le Champignon Bleu",
      option_b: "La Fleur de Feu",
      option_c: "L'Étoile",
      option_d: "La Feuille de Super Tanuki",
      solution: "La Fleur de Feu",
      hint: "Mario change de couleur et devient blanc et rouge.",
      explanation: "La Fleur de Feu transforme Mario en Fire Mario."
    }
  ];

  try {
    console.log("🚀 Lancement du seeding des questions...");
    
    // Nettoyage optionnel (à commenter si tu veux juste ajouter)
    await pool.query('TRUNCATE TABLE questions RESTART IDENTITY CASCADE');
    console.log("🧹 Table questions vidée.");

    for (const q of questions) {
      await pool.query(`
        INSERT INTO questions (content, option_a, option_b, option_c, option_d, solution, hint, explanation)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [q.content, q.option_a, q.option_b, q.option_c, q.option_d, q.solution, q.hint, q.explanation]);
    }

    console.log(`✅ ${questions.length} questions insérées avec succès !`);
  } catch (err) {
    console.error("❌ Erreur pendant le seeding :", err.message);
  } finally {
    await pool.end();
  }
}

seed();
