(function() {
    function trackProgress() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const episodeNo = urlParams.get('episode_no');
            
            // Tentative de récupération du titre via le DOM (plus fiable)
            let titre = "";
            const titleElement = document.querySelector('.subj_info .subj');
            if (titleElement) {
                titre = titleElement.textContent.trim().toUpperCase();
            } else {
                // Fallback sur l'URL si le DOM n'est pas encore chargé
                const pathParts = window.location.pathname.split('/').filter(p => p);
                const viewerIndex = pathParts.indexOf('viewer');
                if (viewerIndex >= 2) {
                    titre = pathParts[viewerIndex - 2].replace(/-/g, ' ').toUpperCase();
                }
            }

            // Récupération du chapitre (depuis l'URL ou le DOM)
            let chapitre = episodeNo;
            if (!chapitre) {
                const epElement = document.querySelector('.subj_info .subj_episode');
                if (epElement) {
                    chapitre = epElement.textContent.replace(/[^0-9]/g, '');
                }
            }

            if (titre && chapitre) {
                const lienComplet = window.location.href;

                chrome.storage.sync.get(['webtoons'], (result) => {
                    let webtoons = result.webtoons || {};
                    
                    // On vérifie si on a déjà cette progression pour éviter d'écrire inutilement
                    const current = webtoons[titre];
                    if (!current || current.chapitre !== chapitre) {
                        webtoons[titre] = {
                            chapitre: chapitre,
                            url: lienComplet,
                            lastUpdate: Date.now()
                        };

                        chrome.storage.sync.set({ webtoons: webtoons }, () => {
                            console.log(`[Webtoon Tracker] ✅ Progression mise à jour : ${titre} (Ep. ${chapitre})`);
                        });
                    }
                });
            }
        } catch (error) {
            console.error('[Webtoon Tracker] Erreur lors de la capture :', error);
        }
    }

    // Exécuter immédiatement
    trackProgress();

    // Ré-exécuter si l'URL change (pour la navigation sans rechargement)
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            trackProgress();
        }
    }, 2000);

})();
