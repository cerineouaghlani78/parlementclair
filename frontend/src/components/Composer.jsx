import { Input } from 'antd'
import { SendIcon, StopIcon } from './icons'
import { dsfr } from '../theme/tokens'

const { TextArea } = Input

// Composer partagé : accueil (docked=false) et conversation (docked=true).
export default function Composer({ docked = false, input, onInput, onKeyDown, streaming, inputEmpty, onPrimary, model }) {
  // Bouton primaire : Stop pendant le streaming (docked), sinon Envoyer.
  const isStop = docked && streaming
  const disabled = isStop ? false : inputEmpty
  const primaryBg = isStop ? dsfr.error : disabled ? dsfr.primaryDisabled : dsfr.primary
  const btnSize = docked ? 36 : 38

  return (
    <div>
      <div
        style={{
          border: `1px solid ${dsfr.borderInput}`,
          borderRadius: 16,
          padding: docked ? '0.6rem 0.6rem 0.5rem 1rem' : '0.7rem 0.7rem 0.55rem 1rem',
          background: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <TextArea
          value={input}
          onChange={onInput}
          onKeyDown={onKeyDown}
          autoSize={{ minRows: docked ? 1 : 2, maxRows: docked ? 6 : 7 }}
          variant="borderless"
          placeholder={
            docked
              ? 'Posez une question de suivi…'
              : "Ex. : Analyse l'impact de la loi sur les énergies renouvelables (APER)"
          }
          style={{ padding: 0, fontSize: docked ? '0.98rem' : '1rem', lineHeight: 1.55, color: dsfr.text }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: docked ? '0.35rem' : '0.4rem' }}>
          <span style={{ flex: '1 1 auto' }} />
          <button
            onClick={onPrimary}
            disabled={disabled}
            title={isStop ? 'Arrêter' : 'Envoyer'}
            style={{
              width: btnSize,
              height: btnSize,
              border: 'none',
              borderRadius: '50%',
              background: primaryBg,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
            }}
          >
            {isStop ? <StopIcon size={14} /> : <SendIcon size={docked ? 18 : 19} />}
          </button>
        </div>
      </div>
      {docked && (
        <div style={{ fontSize: '0.71rem', color: dsfr.grey, marginTop: '0.5rem', textAlign: 'center' }}>
          L'agent {model} peut faire des erreurs — les réponses sont sourcées via Légifrance. Vérifiez les textes
          officiels.
        </div>
      )}
    </div>
  )
}
