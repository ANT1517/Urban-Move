// Simple auth context management

export interface AuthUser {
  id: string
  email: string
  name: string
}

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("authUser")
  return stored ? JSON.parse(stored) : null
}

export const setAuthUser = (user: AuthUser) => {
  localStorage.setItem("authUser", JSON.stringify(user))
}

export const clearAuthUser = () => {
  localStorage.removeItem("authUser")
}
