# LexClair — Frontend React (port du prototype hi-fi)

**Date:** 2026-07-03
**Statut:** Approuvé (design), prêt pour plan d'implémentation
**Portée:** Reconstruire l'interface LexClair (`design/LexClair.dc.html`) en application React autonome sous `frontend/`, avec fixtures locales. Pas de branchement backend à ce stade.

## Contexte

`design/LexClair.dc.html` est un prototype haute-fidélité complet : un composant `DCLogic` (React-like) qui contient l'intégralité de l'état, des données (fixtures) et du comportement de streaming. C'est la **source de vérité**. Les captures `design/screenshots/*.png` montrent une version antérieure (avec épinglage manuel) désormais abandonnée au profit de l'interface LLM épurée du prototype.

L'objectif est un **port fidèle** du prototype vers une vraie app React, dans la stack cible du handoff : **React + Ant Design + D3**, en **JavaScript**, buildée avec **Vite**, re-thémée aux couleurs **DSFR** (Bleu France `#000091`, Rouge Marianne `#ce0500`, police Marianne).

## Décisions de stack

| Choix | Décision | Raison |
|---|---|---|
| Build | Vite + React (JS) | SPA conversationnelle autonome, démarrage/HMR rapides |
| Langage | JavaScript (JSX) | Choix utilisateur |
| UI kit | Ant Design, re-thémé DSFR via `ConfigProvider` | Stack cible du handoff |
| Charts | D3 (`d3-scale`, `d3-shape`) | Stack cible du handoff ; portage des maths SVG du prototype |
| Données | Fixtures locales | Pas de backend pour l'instant |

## Tokens DSFR (extraits du prototype)

- **Primaire (Bleu France):** `#000091` ; hover `#1212ff` ; primaire désactivé `#c5c5f0`
- **Texte:** principal `#161616`, secondaire `#3a3a3a`, atténué `#666`, gris `#929292`
- **Fonds:** blanc `#fff` ; sidebar `#f6f6f6` ; bulle utilisateur `#f0f0f7` ; tool/étape `#f6f6f6`
- **Bordures:** `#eaeaea`, `#eee`, `#e5e5e5`, `#d5d5d5`
- **Succès (vert):** `#18753c` (Pour, coches, connecté) ; fond clair `#eafaef` ; bordure `#b8e6c6`
- **Erreur (Rouge Marianne):** `#ce0500` (Contre, effet défavorable, bouton Stop) ; fond clair `#fdeceb` ; bordure `#f3c4c0`
- **Accents mauves:** tag `#e3e3fd`, points `#c5c5f0`, hover `#f5f5fe` / `#ececf6`, actif `#e6e6f5`
- **Abstention/neutre:** `#929292` ; fond `#f2f2f2` ; bordure `#ddd`
- **Rayons:** 6–16px selon composant. **Police:** Marianne (300/400/500/700), fallback Arial.

Ces valeurs vont dans `src/theme/tokens.js`. Le `ConfigProvider` antd mappe : `colorPrimary #000091`, `colorError #ce0500`, `colorSuccess #18753c`, `fontFamily "Marianne, Arial, sans-serif"`, rayons DSFR.

## Architecture des composants

```
LexClairApp                 conteneur d'état
├─ Sidebar
│   ├─ BrandHeader          logo étoile + "LexClair" / "République Française"
│   ├─ NewAnalysisButton    "Nouvelle analyse" (bleu plein)
│   ├─ SearchLawButton      "Rechercher une loi" (contour) — non fonctionnel (hors périmètre)
│   ├─ HistoryList          groupes { label, items[] } ; item actif surligné
│   └─ McpStatusFooter      point vert + "Base Légifrance connectée · Serveur MCP"
├─ TopBar
│   ├─ "République Française"
│   ├─ ModelSelector        antd Dropdown, liste MODELS, sélection cochée
│   └─ AideLink
└─ main
    ├─ HomeScreen           (messages vides) : hero + Composer + SuggestionGrid (4 cartes)
    └─ Conversation         (messages présents)
        ├─ MessageList
        │   ├─ UserMessage      bulle alignée à droite
        │   ├─ TextMessage      réponse courte de suivi
        │   └─ AnalysisMessage  révélation par étapes (voir ci-dessous)
        └─ Composer (docké)     TextArea + LegifranceToggle + bouton Send/Stop + disclaimer
```

Composants partagés : `Composer` (réutilisé en home et docké), `LegifranceToggle`, `SendStopButton`.

Charts sous `src/components/charts/` : `BudgetChart`, `SectorBars`, `VoteDonut`.

## Modèle d'état (dans `LexClairApp`)

```js
{
  messages: [],        // { role:"user"|"assistant", kind?:"text"|"analysis", text? }
  input: "",
  step: 0,             // 0..7, pilote la révélation de l'analyse
  streaming: false,
  activeConv: "aper",  // id de conversation surlignée dans l'historique
  legifrance: true,    // toggle "Base Légifrance"
  model: "Groq · Llama 3.3",
  modelOpen: false,
}
```

Dérivés (comme `renderVals` du prototype) : `isEmpty`, `hasMessages`, `searching = step===0 && streaming`, `showAnswer = step>=1`, `showMesures = step>=2`, `showSectors = step>=3`, `showBudget = step>=4`, `showVote = step>=5`, `showSources = step>=6`, `showFollowups = step>=7`.

## Comportement — révélation en 7 étapes

`runAnalysis(text, lawId)` : ajoute un message user + un message assistant `kind:"analysis"`, met `step:0, streaming:true`, puis un `setInterval(streamMs)` incrémente `step`. À `step>=7` : `clearInterval`, `streaming:false`.

| step | Bloc révélé |
|---|---|
| 0 (streaming) | ToolStep « Recherche dans la base Légifrance… » (3 points clignotants) |
| ≥1 | Carte « Texte identifié via Légifrance » (titre loi + lien Consulter) + **Synthèse** |
| ≥2 | **Mesures clés** (liste à coches vertes) |
| ≥3 | **Impact estimé par secteur** (barres divergentes D3) |
| ≥4 | **Projection du soutien public** (courbe D3) |
| ≥5 | **Analyse du vote** (donut D3 + répartition + tags de groupes) |
| ≥6 | **Sources** (tags cliquables) |
| ≥7 | **Poursuivre l'analyse** (follow-ups) + fin du streaming |

`stopStream()` : coupe l'interval, force `step:7, streaming:false`.
`sendFollowup(t)` : ajoute user + réponse assistant `kind:"text"` (texte mock du prototype).
`send()` : si une analyse existe déjà → `sendFollowup`, sinon → `runAnalysis(text, "aper")`.
`openConv(id)` : recharge une conversation ; `aper` → analyse complète (`step:7`), autres → message texte d'accroche.
`newConversation()` : réinitialise à l'écran d'accueil.

`streamMs` : constante configurable (défaut 550 ms), exposée en tête de module.

## Charts (D3) — spécifications

**SectorBars** — barres divergentes horizontales. Indice `v ∈ [-100, +100]`, `maxAbs = 85`. Ligne centrale à 50 %. Barre bleue `#000091` (v≥0, part à droite du centre) ou rouge `#ce0500` (v<0, part à gauche). Label à droite `+v`/`v` coloré. Légende : Effet favorable / défavorable / « Indice −100 → +100 ». Données : `SECTORS` (7 lignes).

**BudgetChart** — courbe ligne + aire. `viewBox 0 0 560 200`, marges L40/B28/T14/R14, `maxY=13`. Grille horizontale `[0,4,8,12]`. Aire `rgba(0,0,145,0.10)`, ligne `#000091` 2.5px, points cerclés blancs, labels d'axe X (années), annotation « 12 Md€ » sur le dernier point. Données : `BUDGET` (8 paires `[année, Md€]`). Portage vers `d3.scaleLinear` + `d3.line`/`d3.area`.

**VoteDonut** — donut. Segments Pour `#18753c` (300), Contre `#ce0500` (91), Abstention `#929292` (200), total 591. Rayons ext 90 / int 56, départ `-π/2`, écart 0.02 rad entre segments. Centre : « Adoptée » (vert) + « 591 votants ». Portage vers `d3.arc` + `d3.pie`. À côté : répartition chiffrée (Pour/Contre/Abstention + %) et tags de positions de groupes (`GROUPS`, tons pour/contre/abst).

## Fixtures (`src/data/fixtures.js`)

Reprises **verbatim** du prototype : `LAWS` (5 lois : aper, plf25, sren, iv, retraites), `MESURES` (5), `SECTORS` (7), `BUDGET` (8), `GROUPS` (8), `SOURCES` (4), `EXAMPLES` (4), `FOLLOWUPS` (4), `MODELS` (3). `histGroups` reconstruit à partir de `LAWS` en deux groupes : « Aujourd'hui » (aper) et « 7 derniers jours » (plf25, sren, iv, retraites).

## Correspondance antd

| Élément | antd |
|---|---|
| Structure page | `Layout` / `Layout.Sider` / `Layout.Header` / `Layout.Content` |
| Boutons | `Button` (types `primary`, `default`, ghost custom) |
| Composer | `Input.TextArea` (autoSize) |
| Sélecteur de modèle | `Dropdown` + `Menu` |
| Tags sources/groupes | `Tag` |
| Info-bulles | `Tooltip` |
| Bulles chat / blocs d'analyse | CSS custom (pas d'équivalent antd) |
| Thème | `ConfigProvider theme={{ token, components }}` |

## Structure de fichiers cible

```
frontend/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx                # ConfigProvider DSFR + <LexClairApp/>
   ├─ App.jsx                 # LexClairApp (état + orchestration)
   ├─ theme/
   │   ├─ tokens.js           # couleurs/rayons DSFR + config antd
   │   └─ global.css          # @font-face Marianne, scrollbar, keyframes
   ├─ data/
   │   └─ fixtures.js         # LAWS, MESURES, SECTORS, BUDGET, ...
   ├─ hooks/
   │   └─ useConversation.js  # état messages + runAnalysis/sendFollowup/step
   └─ components/
       ├─ Sidebar.jsx
       ├─ TopBar.jsx
       ├─ ModelSelector.jsx
       ├─ HomeScreen.jsx
       ├─ Composer.jsx
       ├─ Conversation.jsx
       ├─ messages/{UserMessage,TextMessage,AnalysisMessage}.jsx
       └─ charts/{BudgetChart,SectorBars,VoteDonut}.jsx
```

## Hors périmètre (fixtures uniquement)

- Streaming Groq réel / SSE.
- Requêtes MCP / Légifrance réelles ; liens « Consulter »/« Sources » = `#`.
- Résultats de « Rechercher une loi ».
- Routing, persistance, authentification.

Le modèle d'état est structuré pour qu'un futur hook (`useConversation`) puisse remplacer les fixtures par des événements SSE mappés sur les 7 étapes, sans changer l'UI.

## Critères de réussite

1. `npm install && npm run dev` démarre l'app sans erreur.
2. Écran d'accueil : hero, composer, 4 suggestions ; cliquer une suggestion lance l'analyse.
3. L'analyse se révèle en 7 blocs successifs ; le bouton Stop interrompt et affiche tout.
4. Les 3 graphiques (barres divergentes, courbe, donut) s'affichent correctement en D3.
5. Sidebar : historique groupé, item actif surligné, « Nouvelle analyse » réinitialise.
6. Sélecteur de modèle et toggle « Base Légifrance » fonctionnels.
7. Rendu visuellement fidèle au prototype (couleurs DSFR, police Marianne).
