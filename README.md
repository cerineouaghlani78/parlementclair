# 🧪 Test Suite & Coverage (`test/unit-test`)

Ce backlog est dédié à la mise en place, la structuration et l'écriture des tests unitaires de l'application afin de garantir la robustesse du code et d'éviter les régressions.

## 📋 Spécifications & Objectifs

- **Framework cible :** PyTest
- **Objectif de couverture (Coverage) :** > 80% sur les modules principaux core.
- **Isolation :** Utilisation systématique de mocks pour les appels d'API externes, de bases de données ou de grands modèles (LLM).

## 🛠️ To-Do List / Étapes à réaliser

- [ ] **Configuration de l'environnement :**
  - Mettre à jour le fichier `requirements.txt` ou `poetry.lock` avec `pytest`, `pytest-cov`, `black` et `pytest-mock`.
  - Configurer le fichier `pytest.ini` ou la section `[tool.pytest.ini_options]` dans `pyproject.toml`.
- [ ] **Mocks & Fixtures de base :**
  - Créer un fichier `conftest.py` pour stocker les fixtures réutilisables (mocks de réponses d'API, faux clients de base de données).
- [ ] **Écriture des Tests Unitaires :**
  - [ ] Écrire les tests pour le module de parsing de documents (`feature/pdf-parser`).
  - [ ] Écrire les tests pour les fonctions de traitement de données et agrégations (`feature/dataviz`).
  - [ ] Écrire les tests de validation des schémas d'entrée/sortie pour les appels de modèles (`feature/groq-llm`).
- [ ] **Couverture & Intégration :**
  - Générer un rapport HTML (`pytest --cov=. --cov-report=html`) pour identifier les lignes de code non testées.
  - Préparer la commande de validation de pré-commit ou d'intégration continue (CI).

## 🚀 Commande de validation locale
```bash
pytest --cov=src --cov-report=term-missing
