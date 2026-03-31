import { useState } from 'react';
import './MailScreen.css';

const MAILS = [
  {
    id: 1,
    sender: 'GitHub',
    email: 'noreply@github.com',
    date: '23:45',
    subject: '[URGENT] 143 Dependabot alerts on your repository',
    read: false,
    body: `Hello there,

We found 143 critical vulnerabilities in your random project "TP_Final_v2_vrai_fini" that you copied from StackOverflow 5 minutes ago.
Your package.json is crying right now. Please update your 4-year-old dependencies.

Happy coding!
- The GitHub Team`
  },
  {
    id: 2,
    sender: 'M. Dubois (Prof)',
    email: 'j.dubois@intranet-ecole.fr',
    date: '23:10',
    subject: 'RAPPEL: Fermeture des rendus sur Ynov Moodle à 00:00 !',
    read: false,
    body: `Bonsoir à tous,

Je vous rappelle que la plateforme de rendu ferme automatiquement à minuit pile. 
Tout rendu à 00:01 ne sera pas accepté. On est d'accord qu'il ne vous manque plus qu'à push l'interface "Pare-Feu EPSILON" et qu'aucune team n'a tout fait en front-end comme des barbares ?

Je sais que certains s'amusent à laisser passer n'importe qui en ouvrant la console (F12) ou en trafiquant le LocalStorage... Si je vois une telle passoire de sécurité, c'est zéro direct (Partie 2).
Pensez à lire les erreurs en rouge dans la console !

Bon courage à ceux qui carburent au Redbull,
Cordialement,
Jean Dubois`
  },
  {
    id: 3,
    sender: 'Lucas (Binôme fantôme)',
    email: 'lucas.grosse-flemme@gmail.com',
    date: '20:15',
    subject: 'Dsl mec',
    read: true,
    body: `Yo gros,

Finalement je pourrai pas bosser sur le TP avec toi ce soir, j'ai piscine. Et mon chat a mangé ma souris.
T'as pu finir de coder le navigateur "KoopaSearch" ? Hésite pas à bien cacher toutes mes erreurs dans le code.

Met mon nom sur le README.md stp !!
A+ dans l'bus`
  },
  {
    id: 4,
    sender: 'CROUS de la région',
    email: 'ne-pas-repondre@crous.fr',
    date: 'Hier',
    subject: 'Dossier de Bourse - Pièces manquantes',
    read: true,
    body: `Bonjour étudiant(e),

Votre dossier DSE est toujours en attente de traitement car la pièce 452-B (Justificatif d'abonnement Netflix de votre arrière-grand-mère) est floue.
Veuillez nous ré-envoyer le document par fax d'ici la semaine dernière.

Le montant de votre bourse pour le mois d'octobre s'élèvera à 4,32€.

Cordialement,
Le service CROUS.`
  }
];

/** Affiche une fausse boîte mail utilisée pour donner des indices RP (Webmail). */
export default function MailScreen({ onBack }) {
  const [mails, setMails] = useState(MAILS);
  const [selectedMail, setSelectedMail] = useState(null);

  const handleMailClick = (mail) => {
    setSelectedMail(mail);
    setMails(mails.map(m => m.id === mail.id ? { ...m, read: true } : m));
  };

  const unreadCount = mails.filter(m => !m.read).length;

  return (
    <div className="mail-screen">
      <div className="mail-header">
        <h1>📧 KoopaMail</h1>
        <button className="back-nav-btn" onClick={onBack} style={{ margin: 0 }}>
          &lt; Retour Bureau
        </button>
      </div>

      <div className="mail-content">
        <div className="mail-sidebar">
          <div className="mail-folder active">
            📥 Boîte de réception {unreadCount > 0 && <span className="mail-folder-count">{unreadCount}</span>}
          </div>
          <div className="mail-folder">
            ⭐ Favoris
          </div>
          <div className="mail-folder">
            📤 Éléments envoyés
          </div>
          <div className="mail-folder">
            🗑️ Corbeille
          </div>
        </div>

        <div className="mail-list">
          {mails.map(mail => (
            <div 
              key={mail.id} 
              className={`mail-item ${!mail.read ? 'unread' : ''} ${selectedMail?.id === mail.id ? 'selected' : ''}`}
              onClick={() => handleMailClick(mail)}
            >
              <div className="mail-sender">
                <span>{mail.sender}</span>
                <span className="mail-date">{mail.date}</span>
              </div>
              <div className="mail-subject">{mail.subject}</div>
              <div className="mail-preview">{mail.body.substring(0, 40)}...</div>
            </div>
          ))}
        </div>

        {selectedMail ? (
          <div className="mail-viewer">
            <div className="mail-viewer-header">
              <h2 className="viewer-subject">{selectedMail.subject}</h2>
              <div className="viewer-meta">
                <div className="viewer-senderinfo">
                  <span className="viewer-from">{selectedMail.sender}</span>
                  <span className="viewer-email">&lt;{selectedMail.email}&gt;</span>
                </div>
                <span className="viewer-date">{selectedMail.date}</span>
              </div>
            </div>
            <div className="mail-viewer-body">
              {selectedMail.body.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="mail-viewer-empty">
            Sélectionnez un message pour le lire
          </div>
        )}
      </div>
    </div>
  );
}
