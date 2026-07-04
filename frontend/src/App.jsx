import { useConversation } from './hooks/useConversation'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import HomeScreen from './components/HomeScreen'
import Conversation from './components/Conversation'
import { fontFamily, dsfr } from './theme/tokens'

export default function App() {
  const conv = useConversation()

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily, color: dsfr.text, background: '#fff', fontWeight: 400 }}>
      <Sidebar
        activeConv={conv.activeConv}
        onNewConversation={conv.newConversation}
        onOpenConv={conv.openConv}
        onDeleteConv={conv.deleteConv}
        sessions={conv.sessions}
      />

      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        <TopBar
          model={conv.model}
          modelOpen={conv.modelOpen}
          onModelOpenChange={conv.onModelOpenChange}
          onSelectModel={conv.selectModel}
        />

        {conv.isEmpty ? <HomeScreen conv={conv} /> : <Conversation conv={conv} />}
      </div>
    </div>
  )
}
