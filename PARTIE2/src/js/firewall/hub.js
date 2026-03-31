document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('hub-container');
    const totalBarriers = 10;


    if (container) {
        container.innerHTML = '';

        for (let i = 1; i <= totalBarriers; i++) {
            let isUnlocked = localStorage.getItem('barrier' + i) === 'unlocked';
            let isPreviousUnlocked = (i === 1) || (localStorage.getItem('barrier' + (i - 1)) === 'unlocked');

            if (isUnlocked || isPreviousUnlocked) {
                let statusText = isUnlocked ? '✘️ Déverrouillée' : '🔓 inaccessible'; // Fallback 
                if(isUnlocked === false) statusText = '🔔 Accessible';
                let stateClass = isUnlocked ? 'unlocked' : 'accessible';

                let cardHtml = '<div class="barrier-link ' + stateClass + '">';
                cardHtml += '<a href="barrier' + i + '.html">';
                cardHtml += '<div class="barrier-number">' + i + '</div>';
                cardHtml += '<h3>Barrière ' + i + '</h3>';
                cardHtml += '<div class="barrier-status">' + statusText + '</div>';
                cardHtml += '</a></div>';
                
                container.innerHTML += cardHtml;
            }
        }
    }
});