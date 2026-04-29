import { request } from '../request'
import { BrowserList, Browser } from '@providence/interfaces'

export const browser = {
  getBrowsers: async <T extends BrowserList>(params: {
    limit: number
    offset: number
  }): Promise<T> => {
    return request<T>('GET', '/api/v1/browsers', {
      limit: params.limit,
      offset: params.offset,
    })
  },
  getBrowser: async <T extends Browser>(params: {
    browserId: string
  }): Promise<T> => {
    return request<T>('GET', `/api/v1/browsers/${params.browserId}`)
  },
  createBrowser: async <T extends Browser>(params: {
    profileId: string
    name: string | null
    description: string | null
  }): Promise<T> => {
    return request<T>('POST', '/api/v1/browsers', {}, {
      profile_id: params.profileId,
      name: params.name,
      description: params.description,
    })
  },
  updateBrowser: async <T extends Browser>(params: {
    browserId: string
    name: string | null
    description: string | null,
    metadata?: Record<string, any>
  }): Promise<T> => {
    return request<T>('PATCH', `/api/v1/browsers/${params.browserId}`, {}, params)
  },
  deleteBrowser: async (params: {
    browserId: string
  }): Promise<any> => {
    return request<any>('DELETE', `/api/v1/browsers/${params.browserId}`)
  },
  launchBrowser: async <T extends Browser>(browserId: string): Promise<T> => {
    return request<T>('POST', `/api/v1/browsers/${browserId}/launch`)
  },
  terminateBrowser: async <T extends Browser>(browserId: string): Promise<T> => {
    return request<T>('POST', `/api/v1/browsers/${browserId}/halt`)
  },
}