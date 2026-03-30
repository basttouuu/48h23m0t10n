class AdManager {
    constructor() {
        this.zIndexCounter = 100;
        this.maxAds = 45;

        this.adTemplates = [
            { title: "SOS", text: "Ton PC mine du Bitcoin pour payer le cafe de Cyril.", btn: "OKLM" },
            { title: "ALERTE", text: "Rupture de stock a la cafet !!", btn: "PANIQUE TOTALE !" },
            { title: "URGENT", text: "Ton partiel d'Algorithmie vient d'etre supprime.", btn: "RESTAURER" },
            { title: "TUTO", text: "Apprends a centrer une div en 2 jours intensifs sans dormir.", btn: "VOIR LE MIRACLE" },
            { title: "ERREUR", text: "Stack Overflow a crash. Plus de copier/coller.", btn: "ABANDONNER LE METIER" },
            { title: "GAGNANT", text: "Tu as gagne un stage non remunere !!", btn: "ACCEPTER DIRECT" },
            { title: "VIRUS", text: "Ton historique de navigation a fuite sur le grand ecran.", btn: "MOURIR DE HONTE" },
            { title: "SYSTEME", text: "Windows requiert 18 mises a jour.", btn: "METTRE A JOUR MAINTENANT" }
        ];

        document.addEventListener('DOMContentLoaded', () => {
            this.container = document.getElementById('spam-area');
            if (this.container) {
                this.generateInitialChaos();
                setInterval(() => this.spawnRandomAd(), 1500);
            }
        });
    }

    playErrorSound() {
        try {
            const sound = document.getElementById('error-sound');
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.3;
                sound.play().catch((e) => { });
            }
        } catch(e) {}
    }

    generateInitialChaos() {
        for (let i = 0; i < 15; i++) {
            this.spawnRandomAd(true);
        }
    }

    spawnRandomAd(isInitial = false) {
        if (!this.container) return;
        const currentAdsCount = document.querySelectorAll('.ad-trap').length;
        if (currentAdsCount >= this.maxAds) return; 

        const adData = this.adTemplates[Math.floor(Math.random() * this.adTemplates.length)];

        const adElement = document.createElement('div');
        adElement.className = 'ad-card ad-trap';

        const top = Math.random() * 80;
        const left = Math.random() * 80;

        this.zIndexCounter++;
        adElement.style.top = top + '%';
        adElement.style.left = left + '%';
        adElement.style.zIndex = this.zIndexCounter;

        adElement.innerHTML = '<div class="ad-header" onmousedown="adManager.startDrag(event, this.parentElement)"><span>' + adData.title + '</span><span class="close-btn" onclick="hideAd(this)">X</span></div><div class="ad-body">' + adData.text + '<br><button onclick="annoyUser(this)">' + adData.btn + '</button></div>';

        this.container.appendChild(adElement);

        if (!isInitial && Math.random() > 0.5) {
            this.playErrorSound();
        }
    }

    startDrag(e, card) {
        e.preventDefault();
        this.zIndexCounter++;
        card.style.zIndex = this.zIndexCounter;

        let shiftX = e.clientX - card.getBoundingClientRect().left;
        let shiftY = e.clientY - card.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
            card.style.left = pageX - shiftX + 'px';
            card.style.top = pageY - shiftY + 'px';
        };

        const onMouseMove = (event) => {
            moveAt(event.clientX, event.clientY);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    }
}

const adManager = new AdManager();

function hideAd(closeBtn) {
    const card = closeBtn.parentElement.parentElement;
    if (card && card.classList.contains('ad-card')) {
        card.remove();
    }
}

function annoyUser(btn) {
    adManager.playErrorSound();
    const card = btn.parentElement.parentElement;
    if (card && card.classList.contains('ad-card')) {
        card.classList.add('bounce');
        for(let i = 0; i < 3; i++) {
            setTimeout(() => {
                adManager.spawnRandomAd();
            }, i * 200);
        }
    }
}

function accessSecret() {
    window.location.href = 'firewall/hub.html';
}

function handleDocumentClick(e) {
    if(e.target === document.getElementById('spam-area') || e.target.tagName.toLowerCase() === 'body') {
        adManager.spawnRandomAd();
        adManager.playErrorSound();
    }
}
