import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { useConvex } from 'convex/react'

export const Route = createFileRoute('/documents/')({
  component: DocumentsList,
})

function DocumentsList() {
  const convex = useConvex()
  
  const { data: documents } = useSuspenseQuery(
    convexQuery(api.documents.list, {})
  )

  const createDocument = useMutation({
    mutationFn: async () => {
      const newDocId = await convex.mutation(api.documents.create, {
        title: `New Document ${new Date().toLocaleDateString()}`,
      })
      return newDocId
    },
  })

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Documents</h2>
        <button
          onClick={() => createDocument.mutate()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={createDocument.isPending}
        >
          {createDocument.isPending ? 'Creating...' : 'New Document'}
        </button>
      </div>
      
      <div className="space-y-3">
        {documents && documents.length > 0 ? (
          documents.map((doc: any) => (
            <Link
              key={doc._id}
              to="/documents/$documentId"
              params={{ documentId: doc._id }}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold">{doc.title}</h3>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(doc.updatedAt).toLocaleString()}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No documents yet. Create your first document!</p>
        )}
      </div>
    </div>
  )
}