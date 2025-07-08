import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { useEffect, useState, useMemo, useRef } from 'react'
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import { useConvex } from 'convex/react'
import '../../App.css'

export const Route = createFileRoute('/documents/$documentId')({
  component: DocumentEditor,
})

function DocumentEditor() {
  const { documentId } = Route.useParams()
  const [isConnected, setIsConnected] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Convexからドキュメントを取得
  const { data: document } = useSuspenseQuery(
    convexQuery(api.documents.get, { id: documentId as any })
  )

  // Convexを直接使用
  const convex = useConvex()
  
  // ドキュメント更新のミューテーション
  const updateDocument = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      return await convex.mutation(api.documents.update, {
        id: documentId as any,
        content,
      })
    },
  })

  // Y.jsドキュメントとWebSocketプロバイダーの設定
  const { ydoc, provider } = useMemo(() => {
    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      `blocknote-${documentId}`,
      ydoc
    )
    
    return { ydoc, provider }
  }, [documentId])

  // Creates a new editor instance with collaboration.
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: ydoc.getXmlFragment("document-store"),
      user: {
        name: `User ${Math.floor(Math.random() * 1000)}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
    },
    initialContent: document?.content ? JSON.parse(document.content) : [
      {
        type: "heading",
        content: document?.title || "Untitled Document",
        props: {
          level: 1,
        },
      },
      {
        type: "paragraph",
        content: "Start typing...",
      },
    ],
  })

  // エディタの内容が変更されたときの処理
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleEditorChange = () => {
      // 既存のタイムアウトをクリア
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // デバウンスして保存（頻繁な保存を防ぐ）
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true)
        try {
          const blocks = editor.document
          const content = JSON.stringify(blocks)
          // Convexにデータを保存
          await updateDocument.mutateAsync({ content })
        } catch (error) {
          console.error('Failed to save document:', error)
        } finally {
          setIsSaving(false)
        }
      }, 1000) // 1秒後に保存
    }

    // エディタの変更を監視
    editor.onChange(handleEditorChange)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [editor, updateDocument])

  useEffect(() => {
    // 接続状態の監視
    const handleStatus = (event: { status: string }) => {
      setIsConnected(event.status === "connected")
    }

    const handleAwareness = () => {
      setConnectedUsers(provider.awareness.getStates().size)
    }

    provider.on("status", handleStatus)
    provider.awareness.on("change", handleAwareness)

    return () => {
      provider.off("status", handleStatus)
      provider.awareness.off("change", handleAwareness)
    }
  }, [provider])

  // クリーンアップ
  useEffect(() => {
    return () => {
      provider.destroy()
    }
  }, [provider])

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <div className="header-main">
            <h1 className="app-title">{document?.title || 'Loading...'}</h1>
            <p className="app-subtitle">Real-time editing with BlockNote and Convex</p>
          </div>
          
          <div className="collaboration-status">
            <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            
            <div className="users-count">
              <span className="users-icon">👥</span>
              <span className="users-text">{connectedUsers} online</span>
            </div>

            {isSaving && (
              <div className="saving-indicator">
                <span className="saving-text">Saving...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="editor-container">
        <div className="editor-wrapper">
          <BlockNoteView 
            editor={editor} 
            theme="light"
          />
        </div>
      </div>
    </div>
  )
}