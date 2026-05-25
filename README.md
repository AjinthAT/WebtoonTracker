<div align="center">

<img src="./assets/webtoon-tracker-icon.png" alt="Logo Webtoon Tracker" width="128" />

# 📖 Webtoon Tracker

### Sauvegardez automatiquement votre progression de lecture sur WEBTOON et reprenez exactement là où vous vous êtes arrêté.

<br />

[![Installer sur Firefox](https://img.shields.io/badge/Firefox-Installer_Webtoon_Tracker-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/fr/firefox/addon/webtoontracker/)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-16a34a?style=for-the-badge)](./LICENSE)

</div>

---

## ✨ Présentation

**Webtoon Tracker** est une extension Firefox légère et intuitive qui permet de suivre facilement votre progression de lecture sur [WEBTOON](https://www.webtoons.com/).

Plus besoin de mémoriser le dernier chapitre lu ou de rechercher manuellement l’endroit où vous vous étiez arrêté : l’extension sauvegarde votre progression et vous permet de reprendre votre lecture rapidement depuis votre bibliothèque.

---

## 🚀 Fonctionnalités

### 📌 Sauvegarde automatique

Lorsque vous consultez un chapitre sur WEBTOON, l’extension détecte automatiquement la série et mémorise votre progression de lecture.

### 📖 Reprise rapide

Depuis l’interface de l’extension, cliquez sur une série enregistrée pour rouvrir directement le dernier chapitre lu.

### ✍️ Ajout manuel

Vous pouvez ajouter ou modifier manuellement une série et son chapitre actuel, pratique lorsque vous lisez également depuis un autre appareil.

### 🧹 Gestion de la bibliothèque

Supprimez facilement les séries terminées ou celles que vous ne souhaitez plus suivre.

### 🔒 Respect de la vie privée

Webtoon Tracker fonctionne localement dans votre navigateur :

- aucune création de compte ;
- aucune publicité ;
- aucune collecte de données personnelles ;
- aucune transmission de votre progression vers un serveur externe.

---

## 📥 Installation

### Depuis Mozilla Add-ons

Vous pouvez installer Webtoon Tracker directement sur Firefox depuis Mozilla Add-ons :

<div align="center">

[![Installer Webtoon Tracker](https://img.shields.io/badge/Installer_sur_Firefox-Webtoon_Tracker-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/fr/firefox/addon/webtoontracker/)

</div>

## 🛠️ Utilisation

1. Installez l’extension sur Firefox.
2. Rendez-vous sur [WEBTOON](https://www.webtoons.com/).
3. Ouvrez une série et commencez votre lecture.
4. L’extension enregistre automatiquement le chapitre consulté.
5. Cliquez sur l’icône **Webtoon Tracker** dans la barre d’outils Firefox.
6. Sélectionnez une série sauvegardée pour reprendre votre lecture.
7. Utilisez les options disponibles pour ajouter, modifier ou supprimer une progression.

---

## 📁 Structure du projet

```text
webtoontracker/
├── assets/
│   └── webtoon-tracker-icon.png
├── manifest.json
├── popup.js
├── popup.html
├── content.js
├── LICENSE
└── README.md
```

---

## 🔐 Données enregistrées

L’extension peut stocker localement les informations nécessaires au suivi de lecture, par exemple :

- le titre de la série ;
- le dernier chapitre consulté ;
- le lien permettant de reprendre la lecture ;
- les séries ajoutées manuellement.

Ces données servent uniquement au fonctionnement de Webtoon Tracker et restent stockées dans votre navigateur.

---

## 🗺️ Améliorations possibles

Quelques fonctionnalités pourraient être ajoutées dans de futures versions :

- recherche dans la bibliothèque ;
- tri par dernière lecture ;
- statut « terminé » pour les séries finies ;
- export et import local de la progression ;
- affichage de la date de dernière lecture ;
- synchronisation optionnelle entre appareils ;
- prise en charge d’autres plateformes de lecture.

---

## 🐛 Signaler un bug

Vous avez rencontré un problème ? Ouvrez une **Issue** en indiquant autant que possible :

- la version de Firefox utilisée ;
- la page WEBTOON concernée ;
- le comportement attendu ;
- le comportement observé ;
- les étapes permettant de reproduire le bug ;
- une capture d’écran, si nécessaire.

---

## 🤝 Contributions

Les contributions sont les bienvenues.

Pour contribuer au projet :

1. Forkez le dépôt.
2. Créez une branche pour votre modification :

```bash
git checkout -b feature/ma-fonctionnalite
```

3. Effectuez vos changements.
4. Committez votre travail :

```bash
git commit -m "Ajout de ma fonctionnalité"
```

5. Envoyez votre branche :

```bash
git push origin feature/ma-fonctionnalite
```

6. Ouvrez une **Pull Request**.

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**.

Consultez le fichier [LICENSE](./LICENSE) pour plus d’informations.

---

## ⚠️ Avertissement

**Webtoon Tracker** est un projet indépendant.

Cette extension n’est ni affiliée, ni approuvée, ni sponsorisée par **WEBTOON** ou ses propriétaires. Les noms, marques, logos et contenus associés à WEBTOON appartiennent à leurs propriétaires respectifs.