import { useState, useRef, useCallback, useEffect } from 'react'
import * as api from '../api/client'

// Libellés discrets affichés pendant le streaming, dérivés du nom réel de
// l'outil MCP invoqué par le modèle (pas une progression simulée).
const TOOL_LABELS = {
  search_recipes: 'Consultation des méthodes de recherche',
  list_recipes: 'Consultation des méthodes de recherche',
  get_recipe: "Lecture d'une méthode de recherche",
  list_tables: 'Exploration du schéma de données',
  describe_table: 'Exploration du schéma de données',
  get_json_schemas: 'Exploration du schéma de données',
  query_sql: 'Interrogation de la base légale',
  query_typesense: 'Recherche plein texte',
  search_legal_texts: 'Recherche dans Légifrance',
  list_parlement_items: 'Consultation des données parlementaires',
  get_parlement_item: "Lecture d'un document parlementaire",
  get_pastilled_article: "Lecture d'un article",
  get_assemblee_realtime_events: "Suivi des événements de l'Assemblée",
  add_links: 'Enrichissement des sources',
  run_script: "Exécution d'une requête combinée",
  render_fiche: 'Génération de la fiche pédagogique',
}

function toolLabel(name) {
  return TOOL_LABELS[name] || `Appel de l'outil ${name}`
}

// Conversation state réelle : chaque envoi crée/poursuit une session côté
// back-end FastAPI, qui relaie vers vLLM (tool-calling) + le serveur MCP
// Légifrance. Toutes les sessions affichées sont réelles et persistées en base.
export function useConversation() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [toolActivity, setToolActivity] = useState(null)
  const [activeConv, setActiveConv] = useState(null)
  const [model, setModel] = useState('Qwen3.5 · vLLM')
  const [modelOpen, setModelOpen] = useState(false)
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState(null)

  const sessionId = useRef(null)
  const abortRef = useRef(null)

  const refreshSessions = useCallback(async () => {
    try {
      setSessions(await api.listSessions())
    } catch {
      // back-end indisponible : l'historique réel reste simplement vide
    }
  }, [])

  useEffect(() => {
    refreshSessions()
  }, [refreshSessions])

  const sendText = useCallback(
    async (rawText) => {
      const text = rawText.trim()
      if (!text) return

      setError(null)
      setInput('')
      setMessages((m) => m.concat([{ role: 'user', text }]))
      setStreaming(true)
      setToolActivity(null)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        if (!sessionId.current) {
          const session = await api.createSession()
          sessionId.current = session.id
          setActiveConv(session.id)
        }
        const result = await api.sendMessage(sessionId.current, text, {
          signal: controller.signal,
          onEvent: (event) => {
            if (event.type === 'tool_call') setToolActivity(toolLabel(event.name))
          },
        })
        const reply =
          result.kind === 'fiche'
            ? { role: 'assistant', kind: 'fiche', data: result.data }
            : { role: 'assistant', kind: 'text', text: result.text }
        setMessages((m) => m.concat([reply]))
        refreshSessions()
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message)
          setMessages((m) =>
            m.concat([
              { role: 'assistant', kind: 'text', text: 'Désolé, une erreur est survenue : ' + e.message },
            ]),
          )
        }
      } finally {
        setStreaming(false)
        setToolActivity(null)
        abortRef.current = null
      }
    },
    [refreshSessions],
  )

  const stopStream = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    setStreaming(false)
    setToolActivity(null)
  }, [])

  const send = useCallback(() => sendText(input), [input, sendText])
  const sendFollowup = useCallback((t) => sendText(t), [sendText])
  const runAnalysis = useCallback((text) => sendText(text), [sendText])

  const onInput = useCallback((e) => setInput(e.target.value), [])
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (!streaming) send()
      }
    },
    [streaming, send],
  )

  const onModelOpenChange = useCallback((v) => setModelOpen(v), [])
  const closeModel = useCallback(() => setModelOpen(false), [])
  const selectModel = useCallback((name) => {
    setModel(name)
    setModelOpen(false)
  }, [])

  const newConversation = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    sessionId.current = null
    setMessages([])
    setStreaming(false)
    setInput('')
    setActiveConv(null)
    setError(null)
  }, [])

  const openConv = useCallback((id) => {
    if (abortRef.current) abortRef.current.abort()
    setStreaming(false)
    setInput('')
    setError(null)

    sessionId.current = id
    setActiveConv(id)
    api
      .getSession(id)
      .then((session) => {
        setMessages(
          session.messages.map((m) => {
            if (m.role === 'user') return { role: 'user', text: m.content }
            if (m.fiche) return { role: 'assistant', kind: 'fiche', data: m.fiche }
            return { role: 'assistant', kind: 'text', text: m.content }
          }),
        )
      })
      .catch((e) => setError(e.message))
  }, [])

  const deleteConv = useCallback(
    (id) => {
      api
        .deleteSession(id)
        .then(() => {
          if (sessionId.current === id) {
            newConversation()
          }
          refreshSessions()
        })
        .catch((e) => setError(e.message))
    },
    [newConversation, refreshSessions],
  )

  const isEmpty = messages.length === 0

  return {
    // state
    messages,
    input,
    streaming,
    toolActivity,
    activeConv,
    model,
    modelOpen,
    sessions,
    error,
    // actions
    runAnalysis,
    stopStream,
    send,
    sendFollowup,
    onInput,
    onKeyDown,
    onModelOpenChange,
    closeModel,
    selectModel,
    newConversation,
    openConv,
    deleteConv,
    // derived flags
    isEmpty,
    hasMessages: !isEmpty,
    inputEmpty: input.trim().length === 0,
  }
}
