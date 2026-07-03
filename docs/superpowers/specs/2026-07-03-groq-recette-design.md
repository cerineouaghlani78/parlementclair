# Design — Script d'appel à l'API Groq

**Date** : 2026-07-03

## Objectif

Script Python de démonstration qui interroge l'API Groq et affiche, en
streaming, une recette de tarte aux fraises.

## Choix

- **Client** : SDK officiel `groq` (le plus lisible ; gère auth et parsing).
- **Sortie** : streaming (affichage token par token, style chat).
- **Clé API** : lue depuis `.env` via `python-dotenv` (jamais codée en dur).
  `.env` est déjà ignoré par git (`**/.env`).

## Dépendances

- `groq`
- `python-dotenv`

## Fichier

- `groq_recette.py`

## Flux

1. `load_dotenv()` charge `GROQ_API_KEY` depuis `.env`.
2. Si la clé est absente → message d'erreur clair, sortie code 1.
3. Création du client `Groq(api_key=...)`.
4. `chat.completions.create(...)` avec :
   - modèle : `llama-3.3-70b-versatile`
   - message système (« chef pâtissier ») + message utilisateur
     (« recette de tarte aux fraises »)
   - `stream=True`
5. Boucle sur les chunks → `print(..., end="", flush=True)`.

## Gestion d'erreur

`try/except` autour de l'appel API : affiche une erreur lisible en cas
d'échec (réseau, clé invalide, etc.) et sort en code 1.

## Structure

Fonction `main()` + garde `if __name__ == "__main__"`.
