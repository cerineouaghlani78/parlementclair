# 🤖 Groq LLM Integration Module (`feature/groq-llm`)

Cette branche sert à implémenter la brique d'intelligence artificielle en connectant l'application à l'API Groq pour bénéficier de temps de réponse ultra-rapides sur les modèles de langage de pointe.

## 📋 Spécifications & Objectifs

- **Fournisseur :** API Groq Cloud (Modèles cibles : `llama3-70b-8192` ou `mixtral-8x7b-32768`).
- **Cas d'usage :** Génération de résumés automatiques à partir du texte extrait par le parseur PDF, et réponses aux questions de l'utilisateur via une interface de chat.

## 🛠️ To-Do List / Étapes à réaliser

- [ ] **Configuration de l'environnement & Client SDK :**
  - Installer le SDK officiel de Groq (`pip install groq`).
  - Configurer la clé d'API de manière sécurisée via les variables d'environnement (`GROQ_API_KEY`).
- [ ] **Création du Connecteur Core :**
  - Écrire un module ou service `GroqClient` gérant l'initialisation, la configuration de la température, du `max_tokens`, et des timeouts.
- [ ] **Mise en place de l'Ingénierie de Prompt (Prompt Engineering) :**
  - [ ] Créer les prompts de système (`system_prompts`) spécifiques pour la tâche de synthèse et d'analyse.
  - [ ] Configurer le mode d'extraction JSON structuré (`response_format={"type": "json_object"}`) pour forcer le LLM à répondre selon un schéma strict.
- [ ] **Gestion du Contexte & Streaming (Optionnel mais recommandé) :**
  - Implémenter la gestion de la mémoire à court terme (historique des messages du chat).
  - Mettre en place le mode *streaming* pour envoyer la réponse mot par mot à l'UI web pour une meilleure expérience utilisateur.
