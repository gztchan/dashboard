import { proxy } from 'valtio'
import z from 'zod'
import { BrowserService } from './browser'
import { BrowserListSchema } from '@providence/interfaces'
import { browser as api } from '@providence/api'

export interface BrowserManagerServiceState {
  list: string[]
  loading: boolean
}

export class BrowserManagerService {
  state: BrowserManagerServiceState
  browserServices: Map<string, BrowserService> = new Map()

  constructor() {
    this.state = proxy({
      list: [],
      loading: false,
    })
  }

  static createService() {
    return new BrowserManagerService()
  }

  subscribe = z.function({
    input: [],
    output: z.void()
  })
  .implement(() => {
    // Reserved for future real-time subscription wiring.
  })

  fetchBrowsers = z.function({
    input: [
      z.object({
        limit: z.number().optional().default(100),
        offset: z.number().optional().default(0),
      }),
      z.object({
        onSuccess: z.function().input(z.void()).output(z.void()).optional(),
        onError: z.function().input(z.any()).output(z.void()).optional(),
      }).optional(),
    ],
    output: z.void()
  })
  .implement((params, options) => {
    this.state.loading = true;
    (async () => {
      try {
        const browsers = await api.getBrowsers({
          limit: params.limit,
          offset: params.offset,
        })
        const result = BrowserListSchema.parse(browsers)

        for (const browser of result.items) {
          this.browserServices.set(browser.id, BrowserService.createService(browser))
        }

        if (params.offset > 0) {
          this.state.list = [...this.state.list, ...result.items.map((browser) => browser.id)]
        } else {
          this.state.list = result.items.map((browser) => browser.id)
        }
        options?.onSuccess?.()
      } catch (error) {
        console.error(error);
        options?.onError?.(error)
      } finally {
        this.state.loading = false
      }
    })()
  })

  createBrowser = z.function({
    input: [
      z.object({
        profileId: z.string(),
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
        const browser = await api.createBrowser({
          profileId: params.profileId,
          name: params.name ?? null,
          description: params.description ?? '',
        })
        if (!browser) {
          throw new Error('Failed to create browser')
        }
        this.browserServices.set(browser.id, BrowserService.createService(browser))
        this.state.list = [browser.id, ...this.state.list]
        options?.onSuccess?.()
      } catch (error) {
        console.error(error)
      } finally {
        this.state.loading = false
      }
    })()
  })

  deleteBrowser = z.function({
    input: [
      z.object({
        browserId: z.string(),
      }),
      z.object({
        onSuccess: z.function().input(z.void()).output(z.void()).optional(),
        onError: z.function().input(z.any()).output(z.void()).optional(),
      }).optional(),
    ],
    output: z.void()
  })
  .implement((params, options) => {
    this.state.loading = true;
    (async () => {
      try {
        await api.deleteBrowser({
          browserId: params.browserId,
        })
        this.browserServices.delete(params.browserId)
        this.state.list = this.state.list.filter((id) => id !== params.browserId)
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(error)
      } finally {
        this.state.loading = false
      }
    })()
  })
}