export const FAKE_RESULTS = [
  {
    title: "CSS : L'art de tout casser",
    url: 'css-test.biz/qcm',
    desc: 'Vous pensez maîtriser Flexbox ? Venez tester vos connaissances avec le seul QCM où z-index: 9999 est roi.',
    template: 'qcm-css.html'
  },
  {
    title: "Git : La Roulette Russe des développeurs",
    url: 'git-roulette.dev/push-force',
    desc: "Apprenez à effacer l'historique de vos collègues en toute impunité. Prêt à faire un git commit -m 'asdf' ?",
    template: 'qcm-git.html'
  },
  {
    title: "HTML : Le Vrai Hacking",
    url: 'html-hack.net/tutorial',
    desc: 'Oubliez la sécurité, découvrez pourquoi la balise <marquee> reste la technologie la plus avancée du web.',
    template: 'qcm-html.html'
  },
  {
    title: "JS : Le Royaume Incompris",
    url: 'js-magic.io/quiz',
    desc: "Que vaut '[] + []' ? Découvrez-le dans notre quiz. Spoiler : La réponse risque de vous rendre fou.",
    template: 'qcm-javascript.html'
  },
  {
    title: "Vim : Comment quitter l'éditeur ?",
    url: 'vim-sauvetage.org/exit',
    desc: "Vous êtes bloqué dans Vim depuis 3 jours ? Pas de panique, notre QCM vous aidera (peut-être) à trouver la sortie.",
    template: 'qcm-vim.html'
  },
  {
    title: "Déploiement DevOps le vendredi à 17h",
    url: 'devops-friday.com/deploy',
    desc: "Testez votre courage avec notre QCM sur les pires pratiques de déploiement en production avant le week-end.",
    template: 'qcm-devops.html'
  },
  {
    title: "PHP : Le Dinosaure Immortel",
    url: 'php-legacy.fr/quizz',
    desc: "Toujours vivant, toujours debout ! Venez tester vos connaissances sur les variables globales qui plantent le serveur.",
    template: 'qcm-php.html'
  },
  {
    title: "Python : L'illusion de Simplicité",
    url: 'python-easy.io/test',
    desc: "Vous pensez que l'indentation va vous sauver ? Testez notre quiz et découvrez les secrets les plus sombres de Python.",
    template: 'qcm-python.html'
  },
  {
    title: "Scrum : L'art des Réunions Inutiles",
    url: 'agile-scrum.corp/quiz',
    desc: "Combien de daily meetings faut-il pour changer une ampoule ? Évaluez vos compétences en bullshit d'entreprise.",
    template: 'qcm-scrum.html'
  },
  {
    title: "Stack Overflow : Le Copier-Coller en tant que Service",
    url: 'ctrl-c-ctrl-v.com/test',
    desc: "Vous savez faire une recherche sur internet ? Bravo, vous êtes Senior Developer. Prouvez-le içi !",
    template: 'qcm-stackoverflow.html'
  }
];

export const REAL_RESULTS = [
  {
    title: 'Révision avec Mario Quiz Adventure',
    url: 'mario-quiz.io/play',
    desc: "🎮 J'ai de la chance ! Lancez le QCM ultime et prouvez que vous êtes le meilleur développeur du Royaume Champignon.",
    action: 'enter_game',
  },
  {
    title: 'Koopa Corp - Portail Sécurité Interne',
    url: 'sec.koopacorp.biz/login',
    desc: 'Accès restreint. Seuls les administrateurs réseau certifiés sont autorisés à configurer le Firewall EPSILON.',
    action: 'partie2',
  },
  {
    title: 'Accès Terminal - Cœur de Réseau',
    url: 'core.epsilon-net.io/mainframe',
    desc: "Interface d'administration de haut niveau. Veuillez vous identifier pour accéder au terminal de commande principal.",
    action: 'partie3',
  },
];

export function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
