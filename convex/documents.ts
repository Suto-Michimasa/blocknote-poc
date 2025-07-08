import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // ドキュメント一覧はメタデータのみ取得（コンテンツは含まない）
    return await ctx.db.query("documents")
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Document not found");
    }
    
    // ドキュメントのコンテンツを取得
    const content = await ctx.db
      .query("documentContents")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .order("desc")
      .first();
    
    return {
      ...document,
      content: content?.content || "",
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // ドキュメントのメタデータを作成
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // ドキュメントのコンテンツを作成
    await ctx.db.insert("documentContents", {
      documentId,
      content: args.content || "",
      version: 1,
      updatedAt: Date.now(),
    });
    
    return documentId;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // ドキュメントの更新日時を更新
    await ctx.db.patch(args.id, {
      updatedAt: Date.now(),
    });
    
    // 現在のバージョンを取得
    const currentContent = await ctx.db
      .query("documentContents")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .order("desc")
      .first();
    
    const newVersion = (currentContent?.version || 0) + 1;
    
    // 新しいコンテンツを保存
    await ctx.db.insert("documentContents", {
      documentId: args.id,
      content: args.content,
      version: newVersion,
      updatedAt: Date.now(),
    });
  },
});

export const updateTitle = mutation({
  args: {
    id: v.id("documents"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});