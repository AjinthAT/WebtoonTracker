document.addEventListener('DOMContentLoaded', () => {
    const titreInput = document.getElementById('titre');
    const chapitreInput = document.getElementById('chapitre');
    const btnSauvegarder = document.getElementById('sauvegarder');
    const liste = document.getElementById('liste');

    chrome.storage.local.get(['webtoons'], (result) => {
        let webtoons = result.webtoons || {};
        afficherListe(webtoons);
    });

    btnSauvegarder.addEventListener('click', () => {
        const titre = titreInput.value.trim().toUpperCase();
        const chapitre = chapitreInput.value.trim();

        if (titre && chapitre) {
            chrome.storage.local.get(['webtoons'], (result) => {
                let webtoons = result.webtoons || {};
                // Ajout manuel : on n'a pas d'URL, on met null
                webtoons[titre] = { chapitre: chapitre, url: null }; 

                chrome.storage.local.set({ webtoons: webtoons }, () => {
                    afficherListe(webtoons);
                    titreInput.value = '';
                    chapitreInput.value = '';
                });
            });
        }
    });

    function afficherListe(webtoons) {
        liste.innerHTML = '';
        for (const [titre, data] of Object.entries(webtoons)) {
            const li = document.createElement('li');
            
            // --- GESTION DE LA RÉTROCOMPATIBILITÉ ---
            // Si c'est une ancienne sauvegarde (juste un texte), on l'adapte
            let numChapitre = typeof data === 'object' ? data.chapitre : data;
            let lienLivre = typeof data === 'object' ? data.url : null;
            
            // --- CRÉATION DU LIEN ---
            const texte = document.createElement('a');
            texte.textContent = `${titre} - Chap. ${numChapitre}`;
            
            // Si on a une URL, on rend le texte cliquable
            if (lienLivre) {
                texte.href = lienLivre;
                texte.target = '_blank'; // Ouvre dans un nouvel onglet
                texte.style.color = '#0056b3'; // Couleur bleue de lien
                texte.style.textDecoration = 'none'; // Enlève le souligné moche
                texte.style.fontWeight = 'bold';
            } else {
                // S'il n'y a pas d'URL (ajout manuel)
                texte.style.color = '#333';
                texte.style.textDecoration = 'none';
            }

            // --- BOUTON SUPPRIMER ---
            const btnSupprimer = document.createElement('button');
            btnSupprimer.textContent = 'X';
            btnSupprimer.className = 'btn-supprimer';
            btnSupprimer.title = 'Supprimer ce webtoon';
            
            btnSupprimer.addEventListener('click', () => {
                supprimerWebtoon(titre);
            });

            li.appendChild(texte);
            li.appendChild(btnSupprimer);
            liste.appendChild(li);
        }
    }

    function supprimerWebtoon(titreASupprimer) {
        chrome.storage.local.get(['webtoons'], (result) => {
            let webtoons = result.webtoons || {};
            delete webtoons[titreASupprimer];
            chrome.storage.local.set({ webtoons: webtoons }, () => {
                afficherListe(webtoons);
            });
        });
    }
});