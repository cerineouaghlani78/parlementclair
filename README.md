# 📊 Data Visualization & Analytics (`feature/dataviz`)

Cette branche regroupe les développements liés au traitement analytique des données extraites et à leur mise en forme sous forme de graphiques interactifs et explicites.

## 📋 Spécifications & Objectifs

- **Outils de prédilection :** Chart.js, Recharts (si Frontend React) ou Plotly / Seaborn selon l'architecture choisie.
- **Performance :** S'assurer que les données volumineuses sont agrégées côté backend avant d'être envoyées au client web pour éviter les ralentissements d'interface.

## 🛠️ To-Do List / Étapes à réaliser

- [ ] **Modélisation & Agrégation des Données :**
  - Créer des utilitaires de nettoyage et de formatage des données brutes (ex: parsing des dates, calculs de ratios, distributions statistiques).
- [ ] **Développement des endpoints de Visualisation (Backend) :**
  - [ ] Créer un endpoint `/api/viz/summary` renvoyant les indicateurs clés (KPIs).
  - [ ] Créer des routes renvoyant les séries temporelles et les répartitions catégorielles.
- [ ] **Composants Graphiques (Frontend) :**
  - [ ] Implémenter un graphique en courbes (évolution temporelle).
  - [ ] Implémenter un graphique en barres ou camembert (répartition par catégorie).
  - [ ] Ajouter des filtres dynamiques (sélection de périodes, catégories, types de données).
- [ ] **Optimisation :**
  - Mettre en place un système de cache pour les calculs de statistiques lourds afin de réduire le temps de chargement.
