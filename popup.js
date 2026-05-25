document.addEventListener('DOMContentLoaded', () => {
    const titreInput = document.getElementById('titre');
    const chapitreInput = document.getElementById('chapitre');
    const btnSauvegarder = document.getElementById('sauvegarder');
    const rechercheInput = document.getElementById('recherche');
    const liste = document.getElementById('liste');

    let allWebtoons = {};

    // Charger les données initiales
    chrome.storage.sync.get(['webtoons'], (result) => {
        allWebtoons = result.webtoons || {};
        afficherListe(allWebtoons);
    });

    // Gestion de la recherche
    rechercheInput.addEventListener('input', (e) => {
        const terme = e.target.value.toLowerCase();
        const filtres = {};
        
        for (const [titre, data] of Object.entries(allWebtoons)) {
            if (titre.toLowerCase().includes(terme)) {
                filtres[titre] = data;
            }
        }
        afficherListe(filtres);
    });

    btnSauvegarder.addEventListener('click', () => {
        const titre = titreInput.value.trim().toUpperCase();
        const chapitre = chapitreInput.value.trim();

        if (titre && chapitre) {
            chrome.storage.sync.get(['webtoons'], (result) => {
                let webtoons = result.webtoons || {};
                webtoons[titre] = { 
                    chapitre: chapitre, 
                    url: null,
                    lastUpdate: Date.now()
                }; 

                chrome.storage.sync.set({ webtoons: webtoons }, () => {
                    allWebtoons = webtoons;
                    afficherListe(webtoons);
                    titreInput.value = '';
                    chapitreInput.value = '';
                });
            });
        }
    });

    function afficherListe(webtoons) {
        liste.innerHTML = '';
        
        // Tri par date de dernière mise à jour (plus récent en premier)
        const entries = Object.entries(webtoons).sort((a, b) => {
            const dateA = a[1].lastUpdate || 0;
            const dateB = b[1].lastUpdate || 0;
            return dateB - dateA;
        });

        if (entries.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-msg';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.color = '#999';
            emptyMsg.style.fontStyle = 'italic';
            emptyMsg.style.marginTop = '20px';
            emptyMsg.textContent = rechercheInput.value ? 'Aucun résultat trouvé.' : 'Aucun webtoon suivi.';
            liste.appendChild(emptyMsg);
            return;
        }

        for (const [titre, data] of entries) {
            const li = document.createElement('li');
            
            let numChapitre = typeof data === 'object' ? data.chapitre : data;
            let lienLivre = typeof data === 'object' ? data.url : null;
            let lastUpdate = typeof data === 'object' ? data.lastUpdate : null;
            let nomAffiche = (typeof data === 'object' && data.titreAffichage) ? data.titreAffichage : titre;
            
            const infoContainer = document.createElement('div');
            infoContainer.className = 'webtoon-info';

            const texte = document.createElement('a');
            texte.className = 'webtoon-link';
            texte.textContent = `${nomAffiche} - Chap. ${numChapitre}`;
            
            if (lienLivre) {
                texte.href = lienLivre;
                texte.target = '_blank';
                texte.style.color = '#00c564';
            } else {
                texte.style.color = '#666';
                texte.style.cursor = 'default';
            }

            infoContainer.appendChild(texte);

            if (lastUpdate) {
                const dateElement = document.createElement('span');
                dateElement.className = 'last-read';
                const dateLecture = new Date(lastUpdate).toLocaleDateString('fr-FR');
                const heureLecture = new Date(lastUpdate).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
                dateElement.textContent = `Lu le ${dateLecture} à ${heureLecture}`;
                infoContainer.appendChild(dateElement);
            }

            const btnSupprimer = document.createElement('button');
            btnSupprimer.textContent = '✕';
            btnSupprimer.className = 'btn-supprimer';
            btnSupprimer.title = 'Supprimer ce webtoon';
            
            btnSupprimer.addEventListener('click', () => {
                supprimerWebtoon(titre);
            });

            li.appendChild(infoContainer);
            li.appendChild(btnSupprimer);
            liste.appendChild(li);
        }
    }

    function supprimerWebtoon(titreASupprimer) {
        chrome.storage.sync.get(['webtoons'], (result) => {
            let webtoons = result.webtoons || {};
            delete webtoons[titreASupprimer];
            chrome.storage.sync.set({ webtoons: webtoons }, () => {
                allWebtoons = webtoons;
                afficherListe(webtoons);
            });
        });
    }
});
