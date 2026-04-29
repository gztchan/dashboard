import { proxy } from 'valtio'
import { BrowserSchema, type Browser } from '@providence/interfaces'
import z from 'zod'
import { browser as api } from '@providence/api'

export interface BrowserServiceState {
  browser: Browser
  loading: boolean
  launchLoading: boolean
  terminateLoading: boolean
}

export class BrowserService {
  state: BrowserServiceState

  constructor(browser: Browser) {
    this.state = proxy({
      browser,
      loading: false,
      launchLoading: false,
      terminateLoading: false,
    })
  }

  static createService(browser: Browser) {
    return new BrowserService(browser)
  }

  updateBrowser = z.function({
    input: [
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        resolution: z.record(z.string(), z.any()).optional(),
      }),
      z.object({
        onSuccess: z.function().optional(),
        onError: z.function().input(z.any()).optional(),
      }).optional(),
    ],
  })
  .implement((params, options) => {
    if (this.state.loading) {
      return
    }
    this.state.loading = true;
    (async () => {
      try {
        const browser = await api.updateBrowser({
          browserId: this.state.browser.id,
          name: params.name ?? this.state.browser.name,
          description: params.description ?? this.state.browser.description,
          metadata: params.resolution ? { resolution: params.resolution } : undefined,
        })
        if (!browser) {
          throw new Error('Failed to update browser')
        }
        this.state.browser = BrowserSchema.parse(browser)
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(error)
      } finally {
        this.state.loading = false
      }
    })()
  })

  launchBrowser = z.function({
    input: [
      z.object({
        onSuccess: z.function().optional(),
        onError: z.function().input(z.any()).optional(),
      }).optional(),
    ],
  })
  .implement((options) => {
    if (this.state.launchLoading) {
      return
    }
    this.state.launchLoading = true;
    (async () => {
      try {
        const browser = await api.launchBrowser(this.state.browser.id)
        if (!browser) {
          throw new Error('Failed to launch browser')
        }
        this.state.browser = BrowserSchema.parse(browser)
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(error)
      } finally {
        this.state.launchLoading = false
      }
    })()
    return
  })

  terminateBrowser = z.function({
    input: [
      z.object({
        onSuccess: z.function().optional(),
        onError: z.function().input(z.any()).optional(),
      }).optional(),
    ],
  })
  .implement((options) => {
    if (this.state.terminateLoading) {
      return
    }
    this.state.terminateLoading = true;
    (async () => {
      try {
        const browser = await api.terminateBrowser(this.state.browser.id)
        if (!browser) {
          throw new Error('Failed to terminate browser')
        }
        this.state.browser = BrowserSchema.parse(browser)
        options?.onSuccess?.()
      } catch (error) {
        console.log(error)
        options?.onError?.(error)
      } finally {
        this.state.terminateLoading = false
      }
    })()
  })
}