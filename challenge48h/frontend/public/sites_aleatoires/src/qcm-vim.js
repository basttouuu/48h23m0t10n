document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('valider-btn');
    const resultDiv = document.getElementById('result');
    const answers = [2,1,2];

    btn.addEventListener('click', () => {
        let score = 0;
        let answeredAll = true;
        
        for(let i=0; i<answers.length; i++) {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if(!selected) {
                answeredAll = false;
            } else if(parseInt(selected.value) === answers[i]) {
                score++;
            }
        }

        if(!answeredAll) {
            alert(" Alerte erreur critique ! Même les pires stagiaires cochent au hasard. Remplis TOUT !");
            return;
        }

        resultDiv.classList.remove('hidden');
        if(score === answers.length) {
            resultDiv.innerHTML = " <strong>Score Parfait ! (${score}/${answers.length})</strong><br><br>Vous avez atteint le niveau 'Senior Développeur Dangereux'. La production tremble devant vous ! ";
            resultDiv.style.color = "#4CAF50";
        } else if(score > 0) {
            resultDiv.innerHTML = ` <strong>Pas mal... (${score}/${answers.length})</strong><br><br>Vous avez encore un peu d'éthique et de bonnes pratiques. Continuez à troller pour devenir pire ! `;
            resultDiv.style.color = "#FFC107";
        } else {
            resultDiv.innerHTML = " <strong>0 pointé...</strong><br><br>Vous essayez de coder proprement ? Sérieusement ? C'est honteux, sortez du bureau ! ";
            resultDiv.style.color = "#F44336";
        }
        
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    });
});