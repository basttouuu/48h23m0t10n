export const FAKE_RESULTS = [
  {
    title: 'Télécharger Mario Bros gratuit - meilleur-jeux-gratuits.biz',
    url: 'meilleur-jeux-gratuits.biz/mario-download-free',
    desc: 'Télécharge Mario Bros HD gratuitement sur ton PC ! Compatible Windows 11. 100% légal et sans virus. [PUB] Offre limitée...',
  },
  {
    title: 'Mario est-il mort ? La vérité choquante - conspiracies-forum.net',
    url: 'conspiracies-forum.net/mario-vraiment-mort-2024',
    desc: "Des experts affirment que Mario a été remplacé par un clone numérique depuis 1996. Les preuves s'accumulent...",
  },
  {
    title: 'Acheter costume Mario - Amazon.fr',
    url: 'amazon.fr/s?k=costume+mario+adulte+xl',
    desc: 'Plus de 4 800 résultats pour "costume mario adulte". Livraison GRATUITE dès 25€. Note moyenne : 3,2/5.',
  },
  {
    title: 'Super Mario Bros. Film 2023 - Avis & Streaming',
    url: 'filmsenpremiere.xyz/super-mario-bros-film-streaming-vf-hd',
    desc: 'Regardez Super Mario Bros. en streaming VF HD. Inscrivez-vous maintenant — GRATUIT pendant 7 jours !',
  },
  {
    title: 'Comment battre Bowser au niveau 8-4 ? - answers.yahoo.com',
    url: 'answers.yahoo.com/question/index?qid=mario-bowser',
    desc: 'Réponse de XxGamerPro2007xX : "tu vas a droite et tu saute sur lui lol". 47 réponses · 12 ans',
  },
  {
    title: 'Histoire de Mario - Wikipédia (version alternative)',
    url: 'fr.wikpédia.org/wiki/Mario_(personnage)',
    desc: 'Mario (né Mario Mario, Brooklyn, 1981) est un plombier fictif créé par Miyamoto. Attention : cet article contient des inexactitudes.',
  },
  {
    title: 'Forum Mario : "le jeu est truqué !" - gameforum.biz',
    url: 'gameforum.biz/t/mario-est-il-un-jeu-truque-debat',
    desc: "Plus de 3 200 réponses. Dernier message : \"j'ai la preuve que les pièces sont scriptées\". Rejoins le débat !",
  },
  {
    title: 'Recette Champignon Mario (comestible ?) - tuto-cuisine.fr',
    url: 'tuto-cuisine.fr/champignon-mario-comestible-recette',
    desc: 'Oui, vous pouvez manger un champignon Mario ! Voici notre recette inspirée du jeu vidéo. Attention aux allergies.',
  },
];

export const REAL_RESULTS = [
  {
    title: 'Nintendo - Site officiel',
    url: 'https://www.nintendo.com/fr-fr/',
    desc: 'Le site officiel de Nintendo. Découvrez les jeux, les consoles et les actualités Nintendo Switch, Switch 2 et bien plus encore.',
    real: true,
  },
  {
    title: 'Super Mario Wiki — Encyclopédie complète sur Mario',
    url: 'https://www.mariowiki.com/',
    desc: "La référence ultime sur l'univers Mario : personnages, niveaux, jeux, ennemis, historique complet depuis 1981.",
    real: true,
  },
];

export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
