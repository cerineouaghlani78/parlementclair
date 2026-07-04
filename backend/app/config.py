import truststore
from pydantic_settings import BaseSettings, SettingsConfigDict

# Utilise le magasin de certificats du système (Keychain macOS) pour la
# vérification TLS. Nécessaire derrière un proxy/CA d'entreprise, dont la CA
# racine est installée dans le système mais absente du bundle certifi que
# httpx/openai/mcp utilisent par défaut (sinon : CERTIFICATE_VERIFY_FAILED,
# "self-signed certificate in certificate chain"). Injecté ici car config est
# importé en premier par tous les modules, donc avant toute connexion.
truststore.inject_into_ssl()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Endpoint LLM compatible OpenAI. Fonctionne avec n'importe quel fournisseur
    # compatible (vLLM local, Groq cloud, etc.) — seule la config change.
    # Par défaut : vLLM local (PROJET.md), pas de limite de débit/tokens.
    # Pour repasser sur Groq (cloud, gratuit mais limité en débit — cf. essai
    # abandonné pour cette raison, voir historique du projet) : utiliser
    # LLM_BASE_URL=https://api.groq.com/openai/v1, LLM_MODEL=llama-3.3-70b-versatile,
    # LLM_API_KEY=<clé Groq>, et réduire max_tool_iterations/tool_result_max_chars.
    llm_base_url: str = "http://localhost:8000/v1"
    llm_model: str = "qwen3.5"
    llm_api_key: str = "EMPTY"

    # MCP server (Tricoteuses — base législative de l'Assemblée nationale).
    mcp_url: str = "https://mcp.code4code.eu/mcp"

    # Persistence
    db_path: str = "./data/lexclair.db"

    # CORS — front-end Vite dev server
    cors_origins: list[str] = ["http://localhost:5173"]

    # Agent loop safety.
    max_tool_iterations: int = 16
    request_timeout_seconds: float = 120.0

    # Qwen3.5 est lancé avec --reasoning-parser qwen3 (mode "réflexion" avant
    # chaque réponse). Testé : sur une réponse simple, ~28s avec réflexion
    # contre ~1,3s sans — mais sur une question exigeante (plusieurs appels
    # d'outils), désactiver la réflexion fait perdre au modèle le fil de ce
    # qu'il a déjà essayé : il boucle sur des requêtes quasi identiques et
    # épuise tout son budget d'itérations sans jamais conclure (testé : 2m26s
    # et aucune réponse, contre une fiche correcte avec réflexion activée).
    # Gardé activé par défaut : la réflexion coûte du temps par appel mais
    # évite ces boucles improductives sur les questions qui comptent le plus.
    disable_reasoning: bool = False

    # Le modèle vLLM a un contexte de 32768 tokens (cf. PROJET.md). Les résultats
    # d'outils MCP (recherche Légifrance) peuvent être volumineux : on les tronque
    # et on borne l'historique rejoué à chaque tour pour éviter de dépasser la
    # fenêtre de contexte.
    tool_result_max_chars: int = 4000
    history_max_chars: int = 16000


settings = Settings()
