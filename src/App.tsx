import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import "./App.css";

export default function App() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "Welcome to BlockNote",
        props: {
          level: 1,
        },
      },
      {
        type: "paragraph",
        content: "Start writing your document here...",
      },
    ],
  });

  // Renders the editor instance using a React component.
  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <h1 className="app-title">My Documents</h1>
          <p className="app-subtitle">A clean, Notion-like writing experience</p>
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
