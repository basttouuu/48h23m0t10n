
// Logique unifiée pour toutes les barrières (Niveau B1 Info)
document.addEventListener('DOMContentLoaded', function() {
    // Déterminer la barrière actuelle via l'URL
    const url = window.location.pathname;
    const match = url.match(/barrier(\d+)/);
    if (!match) return; // Si on n'est pas sur une barrière, on arrête

    const barrierNum = parseInt(match[1]);
    let password = '';
    let hint = '';

    // Définition des mots de passe et des indices selon la barrière
    if (barrierNum === 1) {
        password = 'html_is_easy';
        hint = '💡 Le html contient parfois des commentaires cachés...';
    } else if (barrierNum === 2) {
        password = 'js_console_pw';
        hint = '💡 Ouvre la console de développement (F12 > Console), une variable globale s y cache...';
        window.backup_password = 'js_console_pw'; // Injection de la faille
    } else if (barrierNum === 3) {
        password = 'css_master';
        hint = '💡 Le mot de passe est sous tes yeux, mais il est de la même couleur que le fond ou caché... Inspecte les éléments !';
    } else if (barrierNum === 4) {
        password = 'local_storage_key';
        hint = '💡 Vérifie le stockage local du navigateur (F12 > Application > Local Storage).';
        localStorage.setItem('adminToken', 'local_storage_key'); // Injection de la faille
    } else if (barrierNum === 5) {
        password = 'cookie_monster_pw';
        hint = '💡 Les cookies sont toujours délicieux (F12 > Application > Cookies).';
        document.cookie = 'session_token=cookie_monster_pw; path=/'; // Injection de la faille
    } else if (barrierNum === 6) {
        password = 'base64_decode';
        hint = '💡 L encodage ce n est pas du chiffrement. Décode le message Base64 et tu trouveras...';
    } else if (barrierNum === 7) {
        password = 'hidden_value_pw';
        hint = '💡 Il y a un champ de texte caché dans cette page... (F12 > Éléments).';
    } else if (barrierNum === 8) {
        password = 'network_tab_pw';
        hint = '💡 Une requête réseau a été faîte au chargement de la page (F12 > Réseau/Network).';
        fetch('fake-api.json?token=network_tab_pw').catch(() => {}); // Injection de la faille
    } else if (barrierNum === 9) {
        password = 'console_log_pw';
        hint = '💡 Il y a un message rouge dans la console (F12 > Console).';
        console.error('ATTENTION ERREUR SYSTEME: Le mot de passe de secours est console_log_pw'); // Injection de la faille
    } else if (barrierNum === 10) {
        password = 'call_me_pw';
        hint = '💡 Appelle la fonction getFlag() dans la console.';
        window.getFlag = function() { return 'call_me_pw'; }; // Injection de la faille
    }

    // Gestion du chronomètre
    const startTime = Date.now();
    setInterval(function() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = elapsed + 's';
        }
    }, 1000);

    // Fonction de vérification du mot de passe (accessible depuis le HTML)
    window.checkPassword = function() {
        const inputField = document.getElementById('password');
        if (!inputField) return;

        const input = inputField.value.trim().toLowerCase();
        const messageEl = document.getElementById('message');
        
        if (input === password) {
            messageEl.textContent = 'Accès confirmé !';
            messageEl.className = 'message success show';
            
            // Sauvegarder la réussite de cette barrière dans le le LocalStorage
            localStorage.setItem('barrier' + barrierNum, 'unlocked');
            
            // Redirection après succès
            setTimeout(function() {
                if (barrierNum === 10) {
                    window.location.href = 'hub.html';
                } else {
                    window.location.href = 'barrier' + (barrierNum + 1) + '.html';
                }
            }, 1000);
        } else {
            messageEl.textContent = '✗ Mot de passe incorrect';
            messageEl.className = 'message error show';
            
            // Augmenter le compteur de tentatives
            let attemptsEl = document.getElementById('attempts');
            if (attemptsEl) {
                let current = parseInt(attemptsEl.textContent.split('/')[0]);
                attemptsEl.textContent = (current + 1) + '/5';
            }
        }
    };

    // Fonction pour afficher l'indice
    window.toggleHint = function() {
        const hintEl = document.getElementById('hint-display');
        if (hintEl) {
            hintEl.textContent = hint;
            hintEl.classList.toggle('show');
        }
    };

    // Permettre la validation avec la touche Entrée
    const inputField = document.getElementById('password');
    if (inputField) {
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.checkPassword();
            }
        });
    }
});
