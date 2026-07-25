/** Live FX helpers — Frankfurter (ECB) free API, no key required */

export const DEFAULT_USD_HKD = 7.8

export type FxFetchResult = {
  rate: number
  asOf: string
  source: 'live' | 'fallback'
}

/**
 * USD → HKD mid-market style rate from Frankfurter.
 * Falls back to invoice sample 7.8 if the request fails.
 */
export async function fetchUsdToHkd(): Promise<FxFetchResult> {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=HKD',
      { signal: AbortSignal.timeout(8000) },
    )
    if (!res.ok) throw new Error(`FX HTTP ${res.status}`)
    const data = (await res.json()) as {
      date?: string
      rates?: { HKD?: number }
    }
    const rate = data.rates?.HKD
    if (!rate || !Number.isFinite(rate) || rate <= 0) {
      throw new Error('FX missing HKD')
    }
    return {
      rate,
      asOf: data.date ?? new Date().toISOString().slice(0, 10),
      source: 'live',
    }
  } catch {
    return {
      rate: DEFAULT_USD_HKD,
      asOf: new Date().toISOString().slice(0, 10),
      source: 'fallback',
    }
  }
}
