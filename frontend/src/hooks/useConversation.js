import { useState, useRef, useCallback, useEffect } from 'react'
import { LAWS, STREAM_MS } from '../data/fixtures'

// Central conversation state + the 7-step streaming reveal.
// Structured so a future SSE-backed hook can drop in without UI changes.
export function useConversation() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [streaming, setStreaming] = useState(false)
  const [activeConv, setActiveConv] = useState('aper')
  const [legifrance, setLegifrance] = useState(true)
  const [model, setModel] = useState('Groq · Llama 3.3')
  const [modelOpen, setModelOpen] = useState(false)

  const timer = useRef(null)
  const found = useRef(null)

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  const runAnalysis = useCallback(
    (text, lawId) => {
      clearTimer()
      const law = LAWS[lawId] || LAWS.aper
      found.current = law
      setActiveConv(law.id)
      setMessages((m) => m.concat([{ role: 'user', text }, { role: 'assistant', kind: 'analysis' }]))
      setInput('')
      setStep(0)
      setStreaming(true)
      timer.current = setInterval(() => {
        setStep((prev) => {
          const next = prev + 1
          if (next >= 7) {
            clearTimer()
            setStreaming(false)
            return 7
          }
          return next
        })
      }, STREAM_MS)
    },
    [clearTimer],
  )

  const stopStream = useCallback(() => {
    clearTimer()
    setStep(7)
    setStreaming(false)
  }, [clearTimer])

  const sendFollowup = useCallback((t) => {
    const short = found.current ? found.current.short : 'ce texte'
    const reply =
      'D’après l’étude d’impact et les données Légifrance rattachées à « ' +
      short +
      ' », voici les éléments de réponse. Je peux détailler chaque point avec les articles concernés et les chiffres associés si vous le souhaitez.'
    setInput('')
    setMessages((m) =>
      m.concat([
        { role: 'user', text: t },
        { role: 'assistant', kind: 'text', text: reply },
      ]),
    )
  }, [])

  const send = useCallback(() => {
    const t = input.trim()
    if (!t) return
    if (messages.some((x) => x.kind === 'analysis')) {
      sendFollowup(t)
    } else {
      runAnalysis(t, 'aper')
    }
  }, [input, messages, runAnalysis, sendFollowup])

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

  const toggleLegifrance = useCallback(() => setLegifrance((v) => !v), [])
  const onModelOpenChange = useCallback((v) => setModelOpen(v), [])
  const closeModel = useCallback(() => setModelOpen(false), [])
  const selectModel = useCallback((name) => {
    setModel(name)
    setModelOpen(false)
  }, [])

  const newConversation = useCallback(() => {
    clearTimer()
    setMessages([])
    setStep(0)
    setStreaming(false)
    setInput('')
    setActiveConv(null)
  }, [clearTimer])

  const openConv = useCallback(
    (id) => {
      clearTimer()
      const law = LAWS[id]
      found.current = law
      setActiveConv(id)
      setStreaming(false)
      setInput('')
      if (id === 'aper') {
        setStep(7)
        setMessages([
          { role: 'user', text: "Analyse l'impact de la loi sur les énergies renouvelables (APER)" },
          { role: 'assistant', kind: 'analysis' },
        ])
      } else {
        setStep(0)
        setMessages([
          { role: 'user', text: 'Peux-tu analyser l’impact de « ' + law.short + ' » ?' },
          {
            role: 'assistant',
            kind: 'text',
            text:
              'J’ai identifié le texte « ' +
              law.title +
              ' » (' +
              law.ref +
              ') dans la base Légifrance. Posez votre question : impact sectoriel, données budgétaires, analyse du vote… j’appuie chaque réponse sur les sources officielles.',
          },
        ])
      }
    },
    [clearTimer],
  )

  const isEmpty = messages.length === 0

  return {
    // state
    messages,
    input,
    step,
    streaming,
    activeConv,
    legifrance,
    model,
    modelOpen,
    foundLaw: found.current,
    // actions
    runAnalysis,
    stopStream,
    send,
    sendFollowup,
    onInput,
    onKeyDown,
    toggleLegifrance,
    onModelOpenChange,
    closeModel,
    selectModel,
    newConversation,
    openConv,
    // derived flags
    isEmpty,
    hasMessages: !isEmpty,
    inputEmpty: input.trim().length === 0,
    searching: step === 0 && streaming,
    showAnswer: step >= 1,
    showMesures: step >= 2,
    showSectors: step >= 3,
    showBudget: step >= 4,
    showVote: step >= 5,
    showSources: step >= 6,
    showFollowups: step >= 7,
  }
}
