import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'

export const Route = createFileRoute('/documents/$documentId')({
  component: DocumentEditor,
})

function DocumentEditor() {
  const { documentId } = Route.useParams()
  const [isConnected, setIsConnected] = useState(false)
  const [userCount, setUserCount] = useState(0)

  const doc = new Y.Doc()
  const provider = new WebsocketProvider(
    "wss://demos.yjs.dev/ws",
    `blocknote-demo-${documentId}`,
    doc,
    {
      connect: true,
    }
  )

  useEffect(() => {
    const handleConnectionChange = () => {
      setIsConnected(provider.wsconnected)
      setUserCount(provider.awareness.getStates().size)
    }

    provider.on('status', handleConnectionChange)
    provider.awareness.on('change', handleConnectionChange)

    const userColors = ['#4b9eff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7']
    const randomColor = userColors[Math.floor(Math.random() * userColors.length)]
    const userId = Math.random().toString(36).substr(2, 9)
    
    provider.awareness.setLocalStateField('user', {
      name: `User ${userId}`,
      color: randomColor,
    })

    return () => {
      provider.off('status', handleConnectionChange)
      provider.awareness.off('change', handleConnectionChange)
      provider.disconnect()
      doc.destroy()
    }
  }, [documentId])

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: provider.awareness.getLocalState()?.user || {
        name: "Anonymous",
        color: "#4b9eff",
      },
    },
  })

  return (
    <div>
      <div className="status-bar">
        <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '● Connected' : '○ Disconnected'}
        </span>
        <span className="user-count">
          👥 {userCount} user{userCount !== 1 ? 's' : ''} online
        </span>
        <span className="document-id">
          Document: {documentId}
        </span>
      </div>
      <BlockNoteView editor={editor} theme="light" />
    </div>
  )
}