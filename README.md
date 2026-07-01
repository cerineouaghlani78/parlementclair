# 🎨 User Interface Development (`feature/web-ui`)

Cette branche est dédiée à la conception, au maquettage et au développement de l'interface utilisateur web (Frontend) permettant d'interagir facilement avec le backend.

## 📋 Spécifications & Objectifs

- **Stack technique conseillée :** React (ou framework existant de l'application) / Tailwind CSS pour un design épuré et responsive.
- **Fluidité :** Intégrer des états de chargement clairs (skeletons ou spinners) lors des traitements lourds (parsing PDF, requêtes LLM).

## 🛠️ To-Do List / Étapes à réaliser

- [ ] **Architecture Frontend :**
  - Initialiser la structure des dossiers (`components/`, `hooks/`, `views/`, `context/`).
  - Mettre en place le routeur si l'application nécessite plusieurs pages.
- [ ] **Composants d'Interface Globaux :**
  - [ ] Créer une disposition globale (Layout) avec une barre latérale ou un menu de navigation.
  - [ ] Développer un composant de téléversement (Drag & Drop) pour les fichiers PDF.
- [ ] **Écrans principaux :**
  - [ ] **Dashboard Principal :** Espace central affichant les graphiques et visualisations de données (`feature/dataviz`).
  - [ ] **Espace Chat / Chatbot :** Interface de discussion pour interagir avec le modèle LLM (`feature/groq-llm`), incluant l'historique des messages.
- [ ] **Connexion API (Axios / Fetch) :**
  - Connecter l'UI aux différents endpoints du backend.
  - Gérer proprement les erreurs réseau et afficher des toasts de notification à l'utilisateur.
