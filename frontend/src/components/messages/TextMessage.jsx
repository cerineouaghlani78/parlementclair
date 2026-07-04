import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatBubbleIcon } from '../icons'
import { dsfr } from '../../theme/tokens'

function AgentBadge() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: dsfr.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        <ChatBubbleIcon size={12} fill="#fff" />
      </span>
      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: dsfr.textMuted }}>ParlementClair</span>
    </div>
  )
}

const paragraphStyle = { fontSize: '0.98rem', lineHeight: 1.65, color: dsfr.textSecondary, margin: '0 0 0.9rem' }
const headingStyle = {
  fontSize: '1.02rem',
  fontWeight: 700,
  color: dsfr.text,
  margin: '1.3rem 0 0.6rem',
  paddingBottom: '0.3rem',
  borderBottom: `1px solid ${dsfr.borderLighter}`,
}
const listStyle = { margin: '0 0 0.9rem', paddingLeft: '1.3rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }
const cellStyle = { padding: '0.5rem 0.7rem', borderBottom: `1px solid ${dsfr.borderLighter}`, textAlign: 'left', fontSize: '0.88rem' }

const markdownComponents = {
  h1: (p) => <h3 style={headingStyle} {...p} />,
  h2: (p) => <h3 style={headingStyle} {...p} />,
  h3: (p) => <h3 style={headingStyle} {...p} />,
  h4: (p) => <h3 style={{ ...headingStyle, fontSize: '0.96rem' }} {...p} />,
  p: (p) => <p style={paragraphStyle} {...p} />,
  ul: (p) => <ul style={listStyle} {...p} />,
  ol: (p) => <ol style={listStyle} {...p} />,
  li: (p) => <li style={{ fontSize: '0.94rem', lineHeight: 1.55, color: dsfr.textSecondary }} {...p} />,
  strong: (p) => <strong style={{ color: dsfr.text, fontWeight: 700 }} {...p} />,
  a: (p) => <a style={{ color: dsfr.primary }} target="_blank" rel="noreferrer" {...p} />,
  table: (p) => (
    <div style={{ overflowX: 'auto', margin: '0 0 1rem', border: `1px solid ${dsfr.borderLighter}`, borderRadius: 8 }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }} {...p} />
    </div>
  ),
  thead: (p) => <thead style={{ background: dsfr.sidebar }} {...p} />,
  th: (p) => <th style={{ ...cellStyle, fontWeight: 600, color: dsfr.text }} {...p} />,
  td: (p) => <td style={cellStyle} {...p} />,
  code: (p) => (
    <code style={{ background: dsfr.sidebar, borderRadius: 4, padding: '0.1rem 0.35rem', fontSize: '0.88em' }} {...p} />
  ),
}

export default function TextMessage({ text }) {
  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <AgentBadge />
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {text}
      </ReactMarkdown>
    </div>
  )
}

export { AgentBadge }
