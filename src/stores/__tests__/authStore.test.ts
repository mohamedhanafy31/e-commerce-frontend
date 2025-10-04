import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../authStore'

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    setToken: jest.fn(),
    clearToken: jest.fn(),
  },
}))

describe('AuthStore Registration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    // Reset the store state
    useAuthStore.setState({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  it('should register successfully', async () => {
    const mockResponse = {
      data: {
        admin: {
          id: 1,
          name: 'Test Admin',
          email: 'test@example.com',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          lastLogin: '2024-01-01T00:00:00.000Z',
        },
        token: 'mock-jwt-token',
        expiresAt: '2024-01-01T08:00:00.000Z',
      },
    }

    const { apiClient } = require('@/lib/api-client')
    apiClient.post.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.register('Test Admin', 'test@example.com', 'TestPass123')
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.admin).toEqual(mockResponse.data.admin)
    expect(result.current.token).toBe(mockResponse.data.token)
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(apiClient.setToken).toHaveBeenCalledWith(mockResponse.data.token)
  })

  it('should handle registration error', async () => {
    const mockError = new Error('Email already exists')
    const { apiClient } = require('@/lib/api-client')
    apiClient.post.mockRejectedValue(mockError)

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      try {
        await result.current.register('Test Admin', 'test@example.com', 'TestPass123')
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.admin).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.error).toBe('Email already exists')
    expect(result.current.isLoading).toBe(false)
  })

  it('should set loading state during registration', async () => {
    const { apiClient } = require('@/lib/api-client')
    // Create a promise that we can control
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    apiClient.post.mockReturnValue(promise)

    const { result } = renderHook(() => useAuthStore())

    // Start registration
    act(() => {
      result.current.register('Test Admin', 'test@example.com', 'TestPass123')
    })

    // Check loading state
    expect(result.current.isLoading).toBe(true)

    // Resolve the promise
    await act(async () => {
      resolvePromise({
        data: {
          admin: { id: 1, name: 'Test Admin', email: 'test@example.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z' },
          token: 'mock-token',
          expiresAt: '2024-01-01T08:00:00.000Z',
        },
      })
    })

    expect(result.current.isLoading).toBe(false)
  })
})
