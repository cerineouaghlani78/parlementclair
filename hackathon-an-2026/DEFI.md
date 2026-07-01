# 🏛️ ParlementClair

> **Rendre l’action parlementaire et législative accessible à tous les citoyens grâce à l'IA et la Data Visualisation.**

Ce projet a été développé dans le cadre du **Hackathon de l'Assemblée nationale**. Son objectif est de briser la barrière de la complexité institutionnelle en transformant les volumineux rapports officiels en fiches synthétiques, visuelles et interactives.

---

## 🚀 Le Pipeline Technologique (4 Étapes)

Le cœur de **ParlementClair** repose sur une architecture automatisée qui extrait, analyse et restitue la donnée législative :

### 1. Segmentation & Extraction (`Python`)
Les rapports officiels et les projets de loi au format PDF font souvent des centaines de pages. Un script Python découpe et segmente intelligemment ces documents volumineux en sections thématiques cohérentes afin de préparer un traitement de texte optimal.

### 2. Synthèse Assistée par IA (`Groq` / `LLM`)
Le texte extrait est transmis à un grand modèle de langage (LLM) propulsé par l'inférence ultra-rapide de **Groq**. Grâce à un prompt d'ingénierie rigoureux, l'IA produit une fiche synthèse structurée qui fait ressortir :
* **Les points clés :** L'essentiel de ce qu'il faut retenir de la loi.
* **Le débat parlementaire :** Une cartographie objective des arguments *Pour* et *Contre*.
* **Les impacts concrets :** Ce que le texte change concrètement dans le quotidien des citoyens.

### 3. Visualisation de Données (`Matplotlib` / `Seaborn`)
Pour rendre la donnée mais plus parlante, les éléments chiffrés (budgets, statistiques d'amendements, volumes de votes) sont automatiquement extraits puis convertis en graphiques épurés, clairs et immédiatement interprétables.

### 4. Interface Citoyenne (`Web`)
Une plateforme web intuitive offre aux citoyens un moteur de recherche par mot-clé, loi ou thématique. Elle permet de consulter directement une **fiche synthèse visuelle** réunissant les textes vulgarisés par l'IA et les infographies associées.

---

## 🛠️ Stack Technique

* **Traitement & Parsing PDF :** Python (PyPDF / PyMuPDF)
* **Moteur d'Intelligence Artificielle :** Groq API (Inférence LLM haute performance)
* **Data Visualisation :** Matplotlib, Seaborn
* **Interface Utilisateur :** _[À compléter : Ex. Streamlit, Flask, ou React/FastAPI]_

---

## 📦 Installation et Démarrage En Local

### Prérequis
* Python 3.10 ou supérieur
* Une clé d'API Groq valide

### 1. Cloner le projet
```bash
git clone [https://github.com/votre-username/ParlementClair.git](https://github.com/cerineouaghlani78/parlementclair.git)
cd parlementclair