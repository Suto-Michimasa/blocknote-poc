import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_updated", ["updatedAt"]),
});