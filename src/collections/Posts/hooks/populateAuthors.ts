import type { CollectionAfterReadHook } from 'payload'
import type { User } from '@/payload-types'

// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req }: any) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    const authorDocs: User[] = []

    for (const author of doc.authors) {
      try {
        const authorDoc = await req.payload.findByID({
          collection: 'users',
          id: author,
        })

        if (authorDoc) {
          authorDocs.push(authorDoc)
        }
      } catch (error) {
        // Handle error gracefully
        console.error('Error fetching author:', error)
      }
    }

    if (authorDocs.length > 0) {
      doc.populatedAuthors = authorDocs.map((authorDoc) => ({
        id: authorDoc.id,
        name: authorDoc.name,
        email: authorDoc.email,
      }))
    }
  }

  return doc
}
