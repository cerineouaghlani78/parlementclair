import { createRoot } from 'react-dom/client'
import PrintableFiche from './PrintableFiche'

// Impression d'une fiche synthèse en PDF via le dialogue natif du navigateur.
// On monte une version « document » (PrintableFiche) dans un conteneur dédié
// #print-root, masqué à l'écran et seul visible en @media print (cf. global.css),
// puis on déclenche window.print(). Le montant est démonté après impression.
// Auto-contenu : LawFiche n'a qu'à appeler printFiche(data), sans prop drilling.

function getPrintRoot() {
  let el = document.getElementById('print-root')
  if (!el) {
    el = document.createElement('div')
    el.id = 'print-root'
    document.body.appendChild(el)
  }
  return el
}

export function printFiche(data) {
  if (!data) return

  const host = getPrintRoot()
  const root = createRoot(host)
  root.render(<PrintableFiche data={data} />)

  const cleanup = () => {
    window.removeEventListener('afterprint', cleanup)
    // Démontage différé : évite de retirer le DOM avant que le dialogue
    // d'impression ait fini de le lire dans certains navigateurs.
    setTimeout(() => root.unmount(), 0)
  }
  window.addEventListener('afterprint', cleanup)

  // Deux rAF pour garantir que le portail est peint avant l'ouverture du
  // dialogue (createRoot rend de façon asynchrone).
  requestAnimationFrame(() => requestAnimationFrame(() => window.print()))
}
