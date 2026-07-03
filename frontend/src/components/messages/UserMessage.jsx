import { dsfr } from '../../theme/tokens'

export default function UserMessage({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.6rem' }}>
      <div
        style={{
          maxWidth: '80%',
          background: dsfr.userBubble,
          color: dsfr.text,
          padding: '0.7rem 1rem',
          borderRadius: '16px 16px 4px 16px',
          fontSize: '0.95rem',
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  )
}
