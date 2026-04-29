import { z } from 'zod'

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
}).transform((data) => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    metadata: data.metadata,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
  }
})

export const ProfileListSchema = z.object({
  items: z.array(ProfileSchema),
  total: z.number(),
})

export type Profile = z.infer<typeof ProfileSchema>
export type ProfileList = z.infer<typeof ProfileListSchema>