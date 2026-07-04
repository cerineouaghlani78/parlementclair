// Client API vers le back-end FastAPI (proxy vLLM + MCP).
// Par défaut, chemin relatif : le front et l'API sont servis sur la même
// origine via le proxy Vite (cf. vite.config.js), ce qui ne nécessite qu'un
// seul tunnel (ngrok/cloudflared) pour la démo, sans CORS à gérer.
const API_BASE = import.meta.env.VITE_API_BASE || ''

async function request(path, options) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body.detail || detail
    } catch {
      // ignore
    }
    throw new Error(detail)
  }
  if (res.status === 204) return null
  return res.json()
}

export function createSession() {
  return request('/api/sessions', { method: 'POST' })
}

export function listSessions() {
  return request('/api/sessions')
}

export function getSession(id) {
  return request(`/api/sessions/${id}`)
}

export function deleteSession(id) {
  return request(`/api/sessions/${id}`, { method: 'DELETE' })
}

// Envoie un message et consomme le flux SSE renvoyé par le back-end : chaque
// événement réel (appel d'outil MCP, résultat, réponse finale) est remonté via
// `onEvent` au fil de l'eau. Retourne le texte de la réponse finale une fois
// le flux terminé.
export async function sendMessage(sessionId, content, { signal, onEvent } = {}) {
  const res = await fetch(`${API_BASE}/api/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
    signal,
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      detail = (await res.json()).detail || detail
    } catch {
      // ignore
    }
    throw new Error(detail)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let result = null
  let errorDetail = null

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let sepIndex
    while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
      const rawEvent = buffer.slice(0, sepIndex)
      buffer = buffer.slice(sepIndex + 2)
      const dataLine = rawEvent.split('\n').find((line) => line.startsWith('data: '))
      if (!dataLine) continue

      const event = JSON.parse(dataLine.slice(6))
      onEvent?.(event)
      if (event.type === 'final') result = { kind: 'text', text: event.content }
      if (event.type === 'fiche') result = { kind: 'fiche', data: event.data }
      if (event.type === 'error') errorDetail = event.detail
    }
  }

  if (errorDetail) throw new Error(errorDetail)
  return result ?? { kind: 'text', text: '' }
}
