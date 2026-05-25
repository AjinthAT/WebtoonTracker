(function() {
    console.log("[Webtoon Tracker] Script de contenu chargé.");

    function trackProgress() {
        try {
            // On ne s'exécute que si on est dans le viewer
            if (!window.location.href.includes('viewer')) return;

            const urlParams = new URLSearchParams(window.location.search);
            const episodeNo = urlParams.get('episode_no');
            
            // 1. Récupération du titre
            let titre = "";
            // Essai via plusieurs sélecteurs possibles (selon les langues)
            const selectors = ['.subj_info .subj', '.viewer_header .subj', 'h2.subj', '.title'];
            for (const s of selectors) {
                const el = document.querySelector(s);
                if (el && el.textContent.trim()) {
                    titre = el.textContent.trim().toUpperCase();
                    break;
                }
            }

            // Fallback sur l'URL si le titre n'est toujours pas trouvé
            if (!titre) {
                const pathParts = window.location.pathname.split('/').filter(p => p);
                const viewerIndex = pathParts.indexOf('viewer');
                if (viewerIndex >= 2) {
                    titre = pathParts[viewerIndex - 2].replace(/-/g, ' ').toUpperCase();
                }
            }

            // 2. Récupération du chapitre
            let chapitre = episodeNo;
            if (!chapitre) {
                const epSelectors = ['.subj_info .subj_episode', '.viewer_header .episode_num'];
                for (const s of epSelectors) {
                    const el = document.querySelector(s);
                    if (el && el.textContent.trim()) {
                        chapitre = el.textContent.replace(/[^0-9]/g, '');
                        break;
                    }
                }
            }

            console.log(`[Webtoon Tracker] Tentative de détection : ${titre} - Chapitre ${chapitre}`);

            if (titre && chapitre) {
                const lienComplet = window.location.href;

                chrome.storage.sync.get(['webtoons'], (result) => {
                    let webtoons = result.webtoons || {};
                    
                    const current = webtoons[titre];
                    // On met à jour si le chapitre change OU si on n'avait pas d'URL (ajout manuel précédent)
                    if (!current || current.chapitre !== chapitre || !current.url) {
                        webtoons[titre] = {
                            chapitre: chapitre,
                            url: lienComplet,
                            lastUpdate: Date.now()
                        };

                        chrome.storage.sync.set({ webtoons: webtoons }, () => {
                            console.log(`[Webtoon Tracker] ✅ Sauvegardé : ${titre} (Ep. ${chapitre})`);
                        });
                    }
                });
            }
        } catch (error) {
            console.error('[Webtoon Tracker] Erreur lors de la capture :', error);
        }
    }

    // Un petit délai car le DOM de Webtoon est parfois lent à charger complètement
    setTimeout(trackProgress, 2000);

    // Surveillance des changements d'URL (Infinite scroll)
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log("[Webtoon Tracker] Changement de page détecté.");
            setTimeout(trackProgress, 1000);
        }
    }, 3000);

})();
