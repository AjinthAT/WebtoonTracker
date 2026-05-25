(function() {
    console.log("[Webtoon Tracker] Détection réactive activée.");

    function getCleanData() {
        const url = window.location.href;
        if (!url.includes('viewer')) return null;

        const titleEl = document.querySelector('.subj_info .subj') || 
                        document.querySelector('.viewer_header .subj') ||
                        document.querySelector('h1.title');
        
        const epEl = document.querySelector('.subj_info .subj_episode') || 
                     document.querySelector('.viewer_header .episode_num');

        let titre = titleEl ? titleEl.textContent.trim() : null;
        let chapitre = epEl ? epEl.textContent.replace(/[^0-9]/g, '') : null;

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
            const key = data.titre.toUpperCase();

            if (!webtoons[key] || webtoons[key].chapitre !== data.chapitre) {
                webtoons[key] = {
                    titreAffichage: data.titre,
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

    // --- OPTIMISATION : MutationObserver ---
    // On surveille les changements dans le titre de la page (balise <title>)
    // qui change dès que l'utilisateur passe au chapitre suivant sur Webtoon.
    const targetNode = document.querySelector('head title');
    if (targetNode) {
        const observer = new MutationObserver(() => {
            console.log("[Webtoon Tracker] Changement détecté via MutationObserver.");
            // Petit délai pour laisser le reste du DOM se mettre à jour
            setTimeout(saveProgress, 1500);
        });
        observer.observe(targetNode, { childList: true, characterData: true, subtree: true });
    }

    // Exécution initiale
    saveProgress();
    setTimeout(saveProgress, 3000); // Sécurité au chargement
})();
