import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import "./App.css";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);

  // Y.jsドキュメントとWebSocketプロバイダーの設定
  const { ydoc, provider } = useMemo(() => {
    const ydoc = new Y.Doc();
    // パブリックWebSocketサーバーを使用（本番環境では独自サーバーを推奨）
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      "blocknote-poc-room",
      ydoc
    );
    
    return { ydoc, provider };
  }, []);

  // Creates a new editor instance with collaboration.
  const editor = useCreateBlockNote({
    collaboration: {
      // Y.js collaboration provider
      provider,
      // ドキュメントフラグメント名
      fragment: ydoc.getXmlFragment("document-store"),
      // ユーザー情報
      user: {
        name: `User ${Math.floor(Math.random() * 1000)}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
    },
    initialContent: [
      {
        type: "heading",
        content: "🚀 Real-time Collaborative Editor",
        props: {
          level: 1,
        },
      },
      {
        type: "paragraph",
        content: "This editor supports real-time collaboration! Open this page in multiple tabs or share with others to see live editing.",
      },
      {
        type: "paragraph",
        content: "✨ Try editing together and see changes appear instantly!",
      },
    ],
  });

  useEffect(() => {
    // 接続状態の監視
    const handleStatus = (event: { status: string }) => {
      setIsConnected(event.status === "connected");
    };

    const handleAwareness = () => {
      setConnectedUsers(provider.awareness.getStates().size);
    };

    provider.on("status", handleStatus);
    provider.awareness.on("change", handleAwareness);

    return () => {
      provider.off("status", handleStatus);
      provider.awareness.off("change", handleAwareness);
    };
  }, [provider]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      provider.destroy();
    };
  }, [provider]);

  // Renders the editor instance using a React component.
  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <div className="header-main">
            <h1 className="app-title">Collaborative Documents</h1>
            <p className="app-subtitle">Real-time editing with BlockNote and Y.js</p>
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
  );
}
