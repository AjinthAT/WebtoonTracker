const url = new URL(window.location.href);
const pathParts = url.pathname.split('/');
const viewerIndex = pathParts.indexOf('viewer');

if (viewerIndex >= 2) {
    let titreBrut = pathParts[viewerIndex - 2]; 
    let titre = titreBrut.replace(/-/g, ' ').toUpperCase(); 
    
    let chapitreBrut = pathParts[viewerIndex - 1]; 
    let chapitre = chapitreBrut.replace('ep', ''); 

    // On récupère le lien complet de la page actuelle
    const lienComplet = window.location.href;

    chrome.storage.local.get(['webtoons'], (result) => {
        let webtoons = result.webtoons || {};
        
        // Au lieu de juste sauvegarder le texte, on sauvegarde un objet avec le chapitre et l'URL
        webtoons[titre] = {
            chapitre: chapitre,
            url: lienComplet
        };

        chrome.storage.local.set({ webtoons: webtoons }, () => {
            console.log(`✅ Sauvegardé : ${titre} Chapitre ${chapitre} avec son URL.`);
        });
    });
}