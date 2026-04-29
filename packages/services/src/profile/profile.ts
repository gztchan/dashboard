import { proxy } from 'valtio'
import { Profile, ProfileSchema } from '@providence/interfaces'
import z from 'zod'
import { profile as api } from '@providence/api'

export interface ProfileServiceState {
  profile: Profile
  loading: boolean
}

export class ProfileService {
  state: ProfileServiceState

  constructor(profile: Profile) {
    this.state = proxy({
      profile,
      loading: false,
    })
  }

  static createService(profile: Profile) {
    return new ProfileService(profile)
  }

  updateProfile = z.function({
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
    output: z.void()
  })
  .implement((params, options) => {
    this.state.loading = true;
    (async () => {
      try {
        const profile = await api.updateProfile({
          profileId: this.state.profile.id,
          name: params.name ?? this.state.profile.name,
          description: params.description ?? this.state.profile.description ?? '',
        })
        if (!profile) {
          throw new Error('Failed to update profile')
        }
        this.state.profile = ProfileSchema.parse(profile)
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(error)
      } finally {
        this.state.loading = false
      }
    })()
  })
}