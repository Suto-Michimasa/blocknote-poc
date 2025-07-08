import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ドキュメントのメタデータ（タイトル、作成日時など）
  documents: defineTable({
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_updated", ["updatedAt"]),
  
  // ドキュメントの実際のコンテンツ
  documentContents: defineTable({
    documentId: v.id("documents"),
    content: v.string(), // BlockNoteのJSONコンテンツ
    version: v.number(), // バージョン管理用
    updatedAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_document_version", ["documentId", "version"]),
});