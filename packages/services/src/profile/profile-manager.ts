import { proxy } from 'valtio'
import { ProfileService } from './profile'
import z from 'zod'
import { profile as api } from '@providence/api'
import { ProfileListSchema } from '@providence/interfaces'

export interface ProfileManagerState {
  profiles: string[]
  loading: boolean
}

export class ProfileManagerService {
  state: ProfileManagerState
  profileServices: Map<string, ProfileService> = new Map()

  constructor() {
    this.state = proxy({
      profiles: [],
      loading: false,
    })
  }

  static createService() {
    return new ProfileManagerService()
  }

  fetchProfiles = z.function({
    input: [
      z.object({
        limit: z.number().optional().default(100),
        offset: z.number().optional().default(0),
      }),
      z.object({
        onSuccess: z.function().optional(),
        onError: z.function().input(z.any()).optional(),
      }).optional(),
    ],
  })
  .implement((params, options) => {
    this.state.loading = true;
    (async () => {
      try {
        const profiles = await api.getProfiles({
          limit: params.limit,
          offset: params.offset,
        })
        const result = ProfileListSchema.parse(profiles)

        for (const profile of result.items) {
          this.profileServices.set(profile.id, ProfileService.createService(profile))
        }
        if (params.offset > 0) {
          this.state.profiles = [...this.state.profiles, ...result.items.map((profile) => profile.id)]
        } else {
          this.state.profiles = result.items.map((profile) => profile.id)
        }
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(error)
      } finally {
        this.state.loading = false
      }
    })()
  })

  createProfile = z.function({
    input: [
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
      }),
      z.object({
        onSuccess: z.function().optional(),
        onError: z.function().input(z.any()).optional(),
      }).optional(),
    ],
  })
  .implement((params, options) => {
    this.state.loading = true;
    (async () => {
      try {
        const profile = await api.createProfile({
          name: params.name ?? '',
          description: params.description ?? '',
        })
        if (!profile) {
          throw new Error('Failed to create profile')
        }
        this.profileServices.set(profile.id, ProfileService.createService(profile))
        this.state.profiles = [profile.id, ...this.state.profiles]
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(error)
      } finally {
        this.state.loading = false
      }
    })()
  })

  deleteProfile = z.function({
    input: [
      z.object({
        profileId: z.string(),
      }),
      z.object({
        onSuccess: z.function().optional(),
        onError: z.function().input(z.any()).optional(),
      }).optional(),
    ],
  })
  .implement((params, options) => {
    this.state.loading = true;
    (async () => {
      try {
        await api.deleteProfile({ profileId: params.profileId })
        this.profileServices.delete(params.profileId)
        this.state.profiles = this.state.profiles.filter((id) => id !== params.profileId)
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(error)
      } finally {
        this.state.loading = false
      }
    })()
  })
}