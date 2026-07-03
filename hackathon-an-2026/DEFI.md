### Nom du défi
ParlementClair

### Description courte
Rendre l’action parlementaire accessible à tous les citoyens en transformant les longs rapports officiels en fiches synthétiques, visuelles et interactives grâce à l'IA (Groq) et à la data visualisation.

### Porteur
Cérine Ouaghlani

### Description longue
Le projet **ParlementClair** part d'un constat simple : la technicité et la longueur des rapports législatifs officiels (projets de loi, rapports de commissions) créent une barrière entre les citoyens et l'action parlementaire. 

Notre objectif est de briser cette barrière en automatisant la vulgarisation et la mise en forme visuelle de ces documents complexes à travers un pipeline structuré en 4 grandes étapes :
1. **Segmentation & Extraction (Python) :** Découpage intelligent des volumineux PDF officiels en sections cohérentes pour optimiser leur analyse.
2. **Synthèse Assistée par IA (Groq) :** Utilisation de la vitesse d'inférence de l'API Groq pour extraire instantanément une structure claire et standardisée comprenant les points clés à retenir, les arguments *Pour* et *Contre*, ainsi que les impacts concrets sur la vie des citoyens.
3. **Data Visualisation (Matplotlib & Seaborn) :** Conversion automatisée des données chiffrées et budgétaires complexes incluses dans les textes en graphiques et infographies épurés.
4. **Interface Citoyenne (Web) :** Une application web intuitive qui centralise ces informations, permettant à n'importe quel utilisateur de chercher une loi et de consulter instantanément sa fiche synthèse visuelle et interactive.

### Image principale
![Image principale](images/cover.png)

### Contributeurs
- Cérine Ouaghlani

### Ressources utilisées
Cochez les ressources utilisées en remplaçant `[ ]` par `[x]`.

- [ ] `openfisca-france-parameters` — Base de données de paramètres ✺ OpenFisca
- [x] `an-dossiers-legislatifs` — Dossiers législatifs de l'Assemblée nationale (législature courante) ✺ Assemblée nationale
- [x] `an-amendements-xvii` — Amendements déposés à l'Assemblée nationale (législature actuelle) ✺ Assemblée nationale
- [x] `an-comptes-rendus` — Comptes rendus de la séance publique à l'Assemblée nationale (législature actuelle) ✺ Assemblée nationale
- [x] `an-votes-xvii` — Votes des députés (législature actuelle) ✺ Assemblée nationale
- [ ] `an-deputes-en-exercice` — Députés en exercice ✺ Assemblée nationale
- [ ] `an-deputes-historique` — Historique des députés ✺ Assemblée nationale
- [ ] `an-deputes-senateurs-ministres-par-legislature` — Députés, sénateurs et ministres d'une législature ✺ Assemblée nationale
- [ ] `an-agenda-reunions` — Agenda des réunions à l'Assemblée nationale (législature courante) ✺ Assemblée nationale
- [ ] `an-questions-gouvernement` — Questions de l'Assemblée nationale au Gouvernement ✺ Assemblée nationale
- [ ] `an-questions-gouvernement-ecrites` — Questions écrites de l'Assemblée nationale au Gouvernement ✺ Assemblée nationale
- [ ] `an-questions-gouvernement-orales` — Questions orales de l'Assemblée nationale au Gouvernement ✺ Assemblée nationale
- [x] `premier-ministre-legi` — Codes, lois et règlements consolidés ✺ Premier ministre
- [ ] `premier-ministre-dole` — Dossiers législatifs Légifrance ✺ Premier ministre
- [x] `premier-ministre-jorf` — Édition ''Lois et décrets'' du Journal officiel ✺ Premier ministre
- [ ] `senat-dispositifs-textes` — Dispositifs des textes déposés ou adoptés au Sénat ✺ Sénat
- [ ] `senat-dossiers-legislatifs` — Dossiers législatifs du Sénat ✺ Sénat
- [ ] `senat-amendements` — Amendements déposés au Sénat ✺ Sénat
- [ ] `senat-senateurs` — Sénateurs ✺ Sénat
- [ ] `senat-questions-gouvernement` — Questions orales et écrites du Sénat au Gouvernement ✺ Sénat
- [ ] `senat-comptes-rendus` — Comptes rendus de la séance publique au Sénat ✺ Sénat
- [ ] `an-et-co-database-regroupement-toutes-donnees` — Base de données unifiée Parlement / Législation / Service Public ✺ Assemblée nationale & communauté
- [ ] `an-et-co-serveur-mcp-regroupement-toutes-donnees` — Serveur MCP  - Accès unifié Parlement / Législation / Service Public ✺ Assemblée nationale & communauté
- [ ] `an-et-co-api-regroupement-toutes-donnees` — API - Accès unifié Parlement / Législation / Service Public ✺ Assemblée nationale & communauté
- [ ] `legiwatch-api-parlement` — API Parlement ✺ LegiWatch
- [ ] `legiwatch-database-parlement` — Base de données Parlement ✺ LegiWatch
- [ ] `legiwatch-serveur-mcp-parlement` — Serveur MCP Parlement ✺ LegiWatch
