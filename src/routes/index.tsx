import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome to BlockNote POC!</h3>
      <p>This is a proof of concept for a Notion-like editor with real-time collaboration.</p>
    </div>
  )
}