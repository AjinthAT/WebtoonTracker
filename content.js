(function() {
    console.log("[Webtoon Tracker] Détection hybride activée.");

    function getCleanData() {
        const url = window.location.href;
        if (!url.includes('viewer')) return null;

        // 1. Tentative via le DOM (pour des titres propres)
        // Sélecteurs testés pour Webtoon EN et FR
        const titleEl = document.querySelector('.subj_info .subj') || 
                        document.querySelector('.viewer_header .subj') ||
                        document.querySelector('h1.title');
        
        const epEl = document.querySelector('.subj_info .subj_episode') || 
                     document.querySelector('.viewer_header .episode_num');

        let titre = titleEl ? titleEl.textContent.trim() : null;
        let chapitre = epEl ? epEl.textContent.replace(/[^0-9]/g, '') : null;

        // 2. Fallback via l'URL (si le DOM n'est pas prêt ou inexistant)
        if (!titre) {
            const pathParts = window.location.pathname.split('/').filter(p => p);
            const viewerIndex = pathParts.indexOf('viewer');
            if (viewerIndex >= 2) {
                titre = pathParts[viewerIndex - 2].replace(/-/g, ' ').toUpperCase();
            }
        }

        if (!chapitre) {
            const urlParams = new URLSearchParams(window.location.search);
            chapitre = urlParams.get('episode_no');
        }

        if (titre && chapitre) {
            return { titre, chapitre, url };
        }
        return null;
    }

    function saveProgress() {
        const data = getCleanData();
        if (!data) return;

        chrome.storage.sync.get(['webtoons'], (result) => {
            let webtoons = result.webtoons || {};
            const key = data.titre.toUpperCase(); // On garde une clé unique en majuscules

            // On ne met à jour que si le chapitre a changé ou si l'entrée est nouvelle
            if (!webtoons[key] || webtoons[key].chapitre !== data.chapitre) {
                webtoons[key] = {
                    titreAffichage: data.titre, // Le beau titre du DOM
                    chapitre: data.chapitre,
                    url: data.url,
                    lastUpdate: Date.now()
                };

                chrome.storage.sync.set({ webtoons: webtoons }, () => {
                    console.log(`[Webtoon Tracker] ✅ Sauvegardé : ${data.titre} (Ep. ${data.chapitre})`);
                });
            }
        });
    }

    // --- STRATÉGIE D'EXÉCUTION ---
    
    // 1. Exécution immédiate
    saveProgress();

    // 2. Ré-essai après 3s (au cas où le DOM était lent à charger)
    setTimeout(saveProgress, 3000);

    // 3. Surveillance du changement d'URL (Infinite Scroll)
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(saveProgress, 2000); // On laisse le temps au nouveau contenu de charger
        }
    }, 3000);
})();
