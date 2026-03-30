function unlockEpsilon() {
    const code = document.getElementById('accessCode').value.toLowerCase().trim();
    const status = document.getElementById('status');

    const validCodes = ['clignoter_le_routeur'];

    if (validCodes.includes(code)) {
        const msgEl = document.createElement('div');
        msgEl.className = 'success';
        msgEl.textContent = '✅ Code accepté! Accès à EPSILON autorisé...';
        status.textContent = '';
        status.appendChild(msgEl);
        setTimeout(() => {
            window.location.href = 'templates/firewall/hub.html';
        }, 1500);
    } else {
        const msgEl = document.createElement('div');
        msgEl.className = 'error';
        msgEl.textContent = '❌ Code invalide. Vérifiez bien les commentaires HTML!';
        status.textContent = '';
        status.appendChild(msgEl);
        document.getElementById('accessCode').value = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('accessCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            unlockEpsilon();
        }
    });
});
