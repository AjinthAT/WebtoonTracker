(function() {
    try {
        const url = new URL(window.location.href);
        const pathParts = url.pathname.split('/').filter(part => part !== '');
        
        // Structure attendue : /en/action/omniscient-reader/viewer?title_no=...
        // On cherche l'index de 'viewer'
        const viewerIndex = pathParts.indexOf('viewer');

        if (viewerIndex >= 2) {
            const titreBrut = pathParts[viewerIndex - 2]; 
            const titre = titreBrut.replace(/-/g, ' ').toUpperCase(); 
            
            const chapitreBrut = pathParts[viewerIndex - 1]; 
            const chapitre = chapitreBrut.replace('ep', '').replace('episode-', ''); 

            const lienComplet = window.location.href;

            chrome.storage.local.get(['webtoons'], (result) => {
                let webtoons = result.webtoons || {};
                
                // On ne met à jour que si les données sont valides
                if (titre && chapitre) {
                    webtoons[titre] = {
                        chapitre: chapitre,
                        url: lienComplet,
                        lastUpdate: Date.now()
                    };

                    chrome.storage.local.set({ webtoons: webtoons }, () => {
                        console.log(`[Webtoon Tracker] ✅ Sauvegardé : ${titre} (Ep. ${chapitre})`);
                    });
                }
            });
        }
    } catch (error) {
        console.error('[Webtoon Tracker] Erreur lors de la capture de la progression :', error);
    }
})();
