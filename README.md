# Chatbot Législatif (MVP)

https://github.com/user-attachments/assets/b5187df4-6be2-4af7-bf73-7e2397085f47


Ce projet est un MVP d'application permettant d'interroger les données législatives françaises. L'objectif est d'obtenir des explications vulgarisées sur les textes de loi et d'analyser leurs impacts sectoriels.

## Fonctionnalités

* Chatbot interactif : Pose de questions sur les lois en langage naturel.
* Vulgarisation : Traduction des textes juridiques en explications accessibles.
* Analyse d'impact : Évaluation des conséquences des projets de loi par secteur.

## Architecture et Données

Le projet fonctionne de manière 100% locale. Il s'appuie sur le protocole MCP (Model Context Protocol) pour connecter directement le modèle aux données ouvertes de l'Assemblée Tricoteuse. 

L'inférence est entièrement gérée en local grâce à vLLM et au modèle Qwen 3.5.

---

## Stack Technique

* **Interface utilisateur :** React
* **Backend / API :** Python Flask
* **Modèle LLM :** Qwen 3.5
* **Moteur d'inférence :** vLLM (Exécution 100% locale)
* **Protocole :** MCP (Model Context Protocol)
* **Source des données :** API / Base de l'Assemblée Tricoteuse

---

### Contributeurs

* Theo Di Rosa
* Alexis Faugeroux
* Cérine Ouaghlani
* Ahmed Dosso
* Lohann Coant--Verdier






