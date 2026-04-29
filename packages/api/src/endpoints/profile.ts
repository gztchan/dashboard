import { request } from '../request'
import { ProfileList, Profile } from '@providence/interfaces'

export const profile = {
  getProfiles: async <T extends ProfileList>(params: {
    limit: number
    offset: number
  }): Promise<T> => {
    return request<T>('GET', '/api/v1/profiles', {
      limit: params.limit,
      offset: params.offset,
    })
  },
  getProfile: async <T extends Profile>(params: {
    profileId: string
  }): Promise<T> => {
    return request<T>('GET', `/api/v1/profiles/${params.profileId}`)
  },
  createProfile: async <T extends Profile>(params: {
    name: string
    description: string
  }): Promise<T> => {
    return request<T>('POST', '/api/v1/profiles', {}, params)
  },
  updateProfile: async <T extends Profile>(params: {
    profileId: string
    name: string
    description: string
  }): Promise<T> => {
    return request<T>('PATCH', `/api/v1/profiles/${params.profileId}`, {}, params)
  },
  deleteProfile: async <T extends Profile>(params: {
    profileId: string
  }): Promise<T> => {
    return request<T>('DELETE', `/api/v1/profiles/${params.profileId}`)
  },
}