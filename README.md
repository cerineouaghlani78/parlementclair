# 📄 PDF Data Parser Pipeline (`feature/pdf-parser`)

Cette branche héberge le code responsable du téléversement, du traitement, de l'extraction et de la structuration des données textuelles et tabulaires issues de documents PDF.

## 📋 Spécifications & Objectifs

- **Robustesse :** Gérer à la fois les PDF natifs (textuels) et les PDF scannés si nécessaire (OCR requis ou non selon spécifications).
- **Format de sortie :** Le parseur doit convertir les sections du PDF en formats hautement structurés (JSON / Dictionnaires Python standardisés) exploitables directement par la brique LLM ou Dataviz.

## 🛠️ To-Do List / Étapes à réaliser

- [ ] **Sélection et Intégration des Librairies :**
  - Évaluer et installer la solution la plus adaptée (`pypdf`, `pdfplumber` pour les tableaux, ou un service cloud d'extraction).
- [ ] **Mise en place de l'extraction de texte :**
  - [ ] Écrire le script principal capable de lire un document page par page.
  - [ ] Développer des regex ou des patterns d'extraction pour capturer les métadonnées (titre, date, auteur, identifiants uniques).
- [ ] **Extraction et Structuration des Tableaux :**
  - [ ] Développer l'algorithme d'identification des structures tabulaires dans les PDF.
  - [ ] Mapper ces données dans un format JSON standardisé ou un DataFrame Pandas propre.
- [ ] **Validation & Gestion des erreurs :**
  - Implémenter des validations de fichiers (taille maximale, vérification du type MIME `application/pdf`).
  - Gérer les exceptions pour les fichiers corrompus ou protégés par mot de passe.
