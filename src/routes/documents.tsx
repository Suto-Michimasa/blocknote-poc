import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/documents')({
  component: Documents,
})

function Documents() {
  return (
    <div className="p-2">
      <h3>Documents</h3>
      <div className="mt-4">
        <Link to="/documents/$documentId" params={{ documentId: 'example-doc' }} className="text-blue-600 hover:underline">
          Example Document
        </Link>
      </div>
    </div>
  )
}