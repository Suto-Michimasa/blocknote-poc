import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// リアルタイム編集操作を保存
export const saveOperation = mutation({
  args: {
    documentId: v.id("documents"),
    operation: v.object({
      type: v.string(),
      data: v.any(),
      timestamp: v.number(),
      userId: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // 操作を保存（必要に応じてテーブルを作成）
    await ctx.db.patch(args.documentId, {
      updatedAt: Date.now(),
    });
    
    // 操作履歴を保存する場合はここで実装
    // await ctx.db.insert("operations", {
    //   documentId: args.documentId,
    //   ...args.operation,
    // });
  },
});

// ドキュメントの最新状態を取得
export const getDocumentState = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }
    
    // リアルタイムの状態を返す
    return {
      id: document._id,
      title: document.title,
      content: document.content,
      updatedAt: document.updatedAt,
    };
  },
});

// オンラインユーザーの状態を更新
export const updateUserPresence = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.string(),
    cursor: v.optional(v.object({
      position: v.number(),
      selection: v.optional(v.object({
        start: v.number(),
        end: v.number(),
      })),
    })),
    isActive: v.boolean(),
  },
  handler: async (_ctx, args) => {
    // ユーザーのプレゼンス情報を更新
    // 実際の実装では専用のpresenceテーブルを使用することを推奨
    console.log("User presence updated:", args);
  },
});