import { z } from 'zod'
import { ProfileSchema } from './profile'

export const BrowserJobSchema = z.object({
  id: z.string(),
  status: z.string(),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
}).transform((data) => {
  return {
    id: data.id,
    status: data.status,
    metadata: data.metadata,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
  }
})

export const BrowserSchema = z.object({
  id: z.string(),
  profile_id: z.string(),
  browser_job_id: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  metadata: z.record(z.string(), z.any()),
  browser_job: BrowserJobSchema.nullable(),
  profile: ProfileSchema,
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
}).transform((data) => {
  return {
    id: data.id,
    profile_id: data.profile_id,
    browser_job_id: data.browser_job_id,
    name: data.name,
    description: data.description,
    metadata: data.metadata,
    browserJob: data.browser_job,
    profile: data.profile,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
  }
})

export const BrowserListSchema = z.object({
  items: z.array(BrowserSchema),
  total: z.number(),
})

export type Browser = z.infer<typeof BrowserSchema>
export type BrowserJob = z.infer<typeof BrowserJobSchema>
export type BrowserList = z.infer<typeof BrowserListSchema>