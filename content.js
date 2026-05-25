(function() {
    // Fonction de capture simplifiée et robuste
    function capture() {
        const url = window.location.href;
        if (!url.includes('viewer')) return;

        const pathParts = window.location.pathname.split('/').filter(p => p);
        const viewerIndex = pathParts.indexOf('viewer');

        if (viewerIndex >= 2) {
            // Extraction fiable via l'URL (marche en FR et EN)
            let titre = pathParts[viewerIndex - 2].replace(/-/g, ' ').toUpperCase();
            
            // Extraction du chapitre via le paramètre d'URL (le plus sûr)
            const urlParams = new URLSearchParams(window.location.search);
            let chapitre = urlParams.get('episode_no');
            
            // Fallback si episode_no absent
            if (!chapitre) {
                chapitre = pathParts[viewerIndex - 1].replace(/[^0-9]/g, '');
            }

            if (titre && chapitre) {
                chrome.storage.sync.get(['webtoons'], (result) => {
                    let webtoons = result.webtoons || {};
                    
                    // On ne met à jour que si nécessaire
                    if (!webtoons[titre] || webtoons[titre].chapitre !== chapitre) {
                        webtoons[titre] = {
                            chapitre: chapitre,
                            url: url,
                            lastUpdate: Date.now()
                        };

                        chrome.storage.sync.set({ webtoons: webtoons }, () => {
                            console.log(`[Webtoon Tracker] ✅ Sauvegardé : ${titre} (Ep. ${chapitre})`);
                        });
                    }
                });
            }
        }
    }

    // Exécution au chargement
    capture();

    // Surveillance des changements d'épisode (navigation fluide)
    let currentUrl = location.href;
    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            capture();
        }
    }, 2000);
})();
