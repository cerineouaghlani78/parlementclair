### Objet : Développement d'un MVP – Interface Chatbot Législatif (RAG/MCP)

**Contexte du projet :** Je développe une application permettant d'interroger la base de données législative française via le protocole MCP (de l'Assemblée nationale). L'objectif est d'obtenir des explications vulgarisées sur les textes de loi et leurs impacts sectoriels.

**État actuel et contraintes techniques :**

- **Front-end :** Déjà opérationnel (code disponible).
    
- **Back-end :** Tentative initiale en Python écartée car les limites de tokens des API gratuites (Groq) sont saturées par le volume de données du MCP.
    
- **Infrastructure :** Déploiement local en cours sur un serveur distant équipé d'un GPU, utilisant **vLLM** via Docker.

```sh
systemd-inhibit --why="Lancement de vLLM en cours" --what=sleep \
  docker run --rm --gpus all \
  -p 8000:8000 \
  --ipc=host \
  -v /run/media/tdi-rosa/MAIN_STORAGE/data/ai/hf-cache:/root/.cache/huggingface \
  vllm/vllm-openai:latest \
  --model QuantTrio/Qwen3.5-9B-AWQ \
  --served-model-name qwen3.5 \
  --enable-auto-tool-choice \
  --tool-call-parser qwen3_xml \
  --reasoning-parser qwen3 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.90
```

Le MCP est tricoteuse: accessible a https://www.tricoteuses.fr/mcp

```python
{
  "mcpServers": {
    "tricoteuses": {
      "transport": "http",
      "url": "https://mcp.code4code.eu/mcp"
    }
  }
}
```
**Objectif du MVP :** Relier le front-end existant à ce serveur vLLM distant. Le back-end doit permettre :

1. La gestion de sessions de chat conversationnel.
    
2. L'acheminement des requêtes vers le serveur vLLM distant.
    
3. La gestion des outils (MCP) pour garantir que l'IA accède correctement à la base législative.
    

**Besoin immédiat :** Le dépôt contient le front-end brut (sans dépendances installées). J'ai besoin d'une structure de back-end (API Gateway) capable de faire le pont entre ce front-end et mon serveur vLLM distant, tout en supportant les appels d'outils (tool calling) pour le MCP.

_Souhaitez-vous que je génère maintenant l'arborescence des fichiers nécessaires et le code du serveur Python pour connecter votre front-end à cette instance vLLM ?_