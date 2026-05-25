document.addEventListener('DOMContentLoaded', () => {
    const titreInput = document.getElementById('titre');
    const chapitreInput = document.getElementById('chapitre');
    const btnSauvegarder = document.getElementById('sauvegarder');
    const liste = document.getElementById('liste');

    chrome.storage.sync.get(['webtoons'], (result) => {
        let webtoons = result.webtoons || {};
        afficherListe(webtoons);
    });

    btnSauvegarder.addEventListener('click', () => {
        const titre = titreInput.value.trim().toUpperCase();
        const chapitre = chapitreInput.value.trim();

        if (titre && chapitre) {
            chrome.storage.sync.get(['webtoons'], (result) => {
                let webtoons = result.webtoons || {};
                // Ajout manuel : on n'a pas d'URL, on met null
                webtoons[titre] = { chapitre: chapitre, url: null }; 

                chrome.storage.sync.set({ webtoons: webtoons }, () => {
                    afficherListe(webtoons);
                    titreInput.value = '';
                    chapitreInput.value = '';
                });
            });
        }
    });

    function afficherListe(webtoons) {
        liste.innerHTML = '';
        const entries = Object.entries(webtoons);

        if (entries.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-msg';
            emptyMsg.textContent = 'Aucun webtoon suivi pour le moment.';
            liste.appendChild(emptyMsg);
            return;
        }

        for (const [titre, data] of entries) {
            const li = document.createElement('li');
            
            let numChapitre = typeof data === 'object' ? data.chapitre : data;
            let lienLivre = typeof data === 'object' ? data.url : null;
            
            const texte = document.createElement('a');
            texte.className = 'webtoon-link';
            texte.textContent = `${titre} - Chap. ${numChapitre}`;
            
            if (lienLivre) {
                texte.href = lienLivre;
                texte.target = '_blank';
                texte.style.color = '#00c564';
            } else {
                texte.style.color = '#666';
                texte.style.cursor = 'default';
            }

            const btnSupprimer = document.createElement('button');
            btnSupprimer.textContent = '✕';
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
        chrome.storage.sync.get(['webtoons'], (result) => {
            let webtoons = result.webtoons || {};
            delete webtoons[titreASupprimer];
            chrome.storage.sync.set({ webtoons: webtoons }, () => {
                afficherListe(webtoons);
            });
        });
    }
});