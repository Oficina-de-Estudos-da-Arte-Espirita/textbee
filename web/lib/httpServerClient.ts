import axios from 'axios'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Session } from 'next-auth'

// Create a base URL that works in Docker container network if running in a container
// or falls back to the public URL if not in a container
const getServerSideBaseUrl = () => {
  // Explicit override for server-side API URL (e.g. Azure Container Apps)
  if (process.env.API_INTERNAL_URL) {
    return process.env.API_INTERNAL_URL
  }
  // When running server-side in Docker Compose, use the service name
  if (process.env.CONTAINER_RUNTIME === 'docker') {
    return 'http://textbee-api:3001/api/v1'
  }
  // Otherwise use the public URL
  return process.env.NEXT_PUBLIC_API_BASE_URL || ''
}

export const httpServerClient = axios.create({
  baseURL: getServerSideBaseUrl(),
})

httpServerClient.interceptors.request.use(async (config) => {
  const session: Session | null = await getServerSession(authOptions as any)
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`
  }
  return config
})
