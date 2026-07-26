const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'
const STORAGE_KEY = 'farmacontrol_api_base'

export function getStoredApiBase() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_API_BASE
}

export function setStoredApiBase(value) {
  localStorage.setItem(STORAGE_KEY, value)
}

export async function apiFetch(apiBase, path, options = {}) {
  const response = await fetch(`${apiBase.replace(/\/$/, '')}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const text = await response.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const message = typeof data === 'string'
      ? data
      : data?.message || data?.title || 'Ocurrio un error al consumir la API.'
    throw new Error(message)
  }

  return data
}

export function formatMoney(value) {
  return Number(value || 0).toLocaleString('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
  })
}

export function formatDate(value, includeTime = false) {
  if (!value) return '-'
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString('es-DO', includeTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' })
}

export function daysUntil(dateValue) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const date = new Date(dateValue)
  date.setHours(0, 0, 0, 0)

  return Math.round((date - today) / 86400000)
}
